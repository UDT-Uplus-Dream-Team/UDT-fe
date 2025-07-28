import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

interface CustomJWTPayload extends JoseJWTPayload {
  sub: string;
  ROLE: string;
  iat: number;
  exp: number;
}

const PUBLIC_PATHS = ['/_next', '/favicon.ico', '/fonts', '/images', '/icons'];

const ROLE_RESTRICTIONS = {
  ROLE_GUEST: {
    allowed: ['/survey'],
    denied: [],
  },
  ROLE_USER: {
    allowed: [],
    denied: ['/survey', '/admin'],
  },
  ROLE_ADMIN: {
    allowed: [],
    denied: ['/survey'],
  },
} as const;

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function addMessageToUrl(url: URL, type: string, message: string): URL {
  const encodedMessage = Buffer.from(message, 'utf-8').toString('base64');
  url.searchParams.set('auth_msg', type);
  url.searchParams.set('auth_text', encodedMessage);
  return url;
}

async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log('JWT PAYLOAD:', payload);

    if (
      typeof payload.sub === 'string' &&
      typeof payload.ROLE === 'string' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      return payload as CustomJWTPayload;
    }

    return null;
  } catch (error) {
    console.error('JWT VERIFICATION FAILED:', error);
    return null;
  }
}

function isStaticPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

function hasPermission(role: string, pathname: string): boolean {
  const restrictions =
    ROLE_RESTRICTIONS[role as keyof typeof ROLE_RESTRICTIONS];

  if (!restrictions) {
    return false;
  }

  // GUEST의 경우: allowed 목록에 있는 경로만 접근 가능
  if (role === 'ROLE_GUEST') {
    const hasAccess = restrictions.allowed.some((path) =>
      pathname.startsWith(path),
    );
    return hasAccess;
  }

  // USER, ADMIN의 경우: denied 목록에 없으면 접근 가능
  const isDenied = restrictions.denied.some((path) =>
    pathname.startsWith(path),
  );
  return !isDenied;
}

function getDefaultPath(role: string): string {
  switch (role) {
    case 'ROLE_GUEST':
      return '/survey';
    case 'ROLE_ADMIN':
      return '/admin';
    case 'ROLE_USER':
    default:
      return '/recommend';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('Authorization')?.value;

  if (pathname === '/') {
    if (!token) {
      return NextResponse.next();
    } else {
      const payload = await verifyToken(token);

      if (!payload) {
        const response = NextResponse.next();
        response.cookies.delete('Authorization');
        return response;
      }

      const defaultPath = getDefaultPath(payload.ROLE);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }
  }

  if (!token) {
    const redirectUrl = addMessageToUrl(
      new URL('/', request.url),
      'auth-required',
      '로그인이 필요합니다.',
    );
    return NextResponse.redirect(redirectUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const redirectUrl = addMessageToUrl(
      new URL('/', request.url),
      'auth-expired',
      '세션이 만료되었습니다. 다시 로그인해주세요.',
    );
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete('Authorization');
    return response;
  }

  // 루트 경로 접근 시 역할별 기본 페이지로 리다이렉트
  if (pathname === '/') {
    const defaultPath = getDefaultPath(payload.ROLE);
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  // 역할별 권한 확인
  if (!hasPermission(payload.ROLE, pathname)) {
    const defaultPath = getDefaultPath(payload.ROLE);
    console.log(
      `🚫 NO PERMISSION - ROLE: ${payload.ROLE}, PATH: ${pathname}, REDIRECTING TO: ${defaultPath}`,
    );
    const redirectUrl = addMessageToUrl(
      new URL(defaultPath, request.url),
      'access-denied',
      '잘못된 접근입니다.',
    );
    return NextResponse.redirect(redirectUrl);
  }

  console.log('✅ ACCESS GRANTED');
  return NextResponse.next();
}

export const config = {
  matcher: ['/(.*)'],
};
