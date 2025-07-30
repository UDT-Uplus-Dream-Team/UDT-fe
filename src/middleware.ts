import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

interface CustomJWTPayload extends JoseJWTPayload {
  sub: string;
  ROLE: string;
  iat: number;
  exp: number;
}

const PUBLIC_PATHS = [
  '/_next',
  '/favicon.ico',
  '/fonts',
  '/images',
  '/icons',
  '/test',
];

const ROLE_RESTRICTIONS = {
  ROLE_GUEST: { allowed: ['/survey'], denied: [] },
  ROLE_USER: { allowed: [], denied: ['/survey', '/admin'] },
  ROLE_ADMIN: { allowed: [], denied: ['/survey', '/onboarding'] },
} as const;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function addMessageToUrl(url: URL, type: string, msg: string): URL {
  url.searchParams.set('auth_msg', type);
  url.searchParams.set(
    'auth_text',
    Buffer.from(msg, 'utf-8').toString('base64'),
  );
  return url;
}

function isStaticPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function hasPermission(role: string, pathname: string): boolean {
  const r = ROLE_RESTRICTIONS[role as keyof typeof ROLE_RESTRICTIONS];
  if (!r) return false;

  if (role === 'ROLE_GUEST') {
    return r.allowed.some((p) => pathname.startsWith(p));
  }

  return !r.denied.some((p) => pathname.startsWith(p));
}

function getDefaultPath(role: string, req: NextRequest): string {
  switch (role) {
    case 'ROLE_GUEST':
      return '/survey';
    case 'ROLE_ADMIN':
      return '/admin';
    case 'ROLE_USER':
      return req.cookies.get('X-New-User')?.value === 'true'
        ? '/onboarding'
        : '/recommend';
    default:
      return '/recommend';
  }
}

interface TokenVerificationResult {
  payload: CustomJWTPayload | null;
  isExpired: boolean;
  isInvalid: boolean;
}

/* -------------------------------------------------------------------------- */
/* JWT 검증 - 만료/무효 상태 구분                                              */
/* -------------------------------------------------------------------------- */
async function verifyToken(token: string): Promise<TokenVerificationResult> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.sub === 'string' &&
      typeof payload.ROLE === 'string' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      return {
        payload: payload as CustomJWTPayload,
        isExpired: false,
        isInvalid: false,
      };
    }

    return {
      payload: null,
      isExpired: false,
      isInvalid: true,
    };
  } catch (error) {
    console.error('JWT VERIFICATION FAILED:', error);

    // jose 라이브러리의 만료 에러 감지
    if (error === 'ERR_JWT_EXPIRED') {
      return {
        payload: null,
        isExpired: true,
        isInvalid: false,
      };
    }

    return {
      payload: null,
      isExpired: false,
      isInvalid: true,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* 리프레시 토큰 기반 재발급                                                   */
/* -------------------------------------------------------------------------- */
async function reissueToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reissue/token`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    return response.status === 204;
  } catch (err) {
    console.error('reissueToken 네트워크 오류', err);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* 미들웨어                                                                   */
/* -------------------------------------------------------------------------- */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* -------- 정적 자원 -------- */
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  /* -------- 쿠키 추출 -------- */
  const token = request.cookies.get('Authorization')?.value;

  /* -------- 루트(/) 처리 -------- */
  if (pathname === '/') {
    if (!token) {
      return NextResponse.next();
    }

    const verification = await verifyToken(token);

    if (verification.payload) {
      // 유효한 토큰이 있으면 기본 경로로 리다이렉트
      const defaultPath = getDefaultPath(verification.payload.ROLE, request);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    if (verification.isExpired) {
      /* ★ 수정: reissueToken 인자·구조 변경 */
      const ok = await reissueToken(); // ← 인자 삭제, 불린 반환으로 변경
      if (ok) {
        return NextResponse.redirect(new URL('/', request.url)); // set-cookie 수동 전달 불필요
      }
    }

    // 재발급 실패하거나 무효한 토큰인 경우 쿠키 삭제하고 메인 페이지 유지
    const response = NextResponse.next();
    response.cookies.delete('Authorization');
    return response;
  }

  /* -------- 비로그인 상태 -------- */
  if (!token) {
    return NextResponse.redirect(
      addMessageToUrl(
        new URL('/', request.url),
        'auth-required',
        '로그인이 필요합니다.',
      ),
    );
  }

  /* -------- 토큰 검증 -------- */
  const verification = await verifyToken(token);

  if (verification.payload) {
    // 유효한 토큰이 있는 경우 권한 체크로 진행
    if (!hasPermission(verification.payload.ROLE, pathname)) {
      const defaultPath = getDefaultPath(verification.payload.ROLE, request);
      return NextResponse.redirect(
        addMessageToUrl(
          new URL(defaultPath, request.url),
          'access-denied',
          '잘못된 접근입니다.',
        ),
      );
    }
    return NextResponse.next();
  }

  if (verification.isExpired) {
    /* ★ 수정: reissueToken 인자·구조 변경 */
    const ok = await reissueToken(); // ← 인자 삭제, 불린 반환으로 변경
    if (ok) {
      return NextResponse.redirect(new URL(pathname, request.url));
    }

    // 재발급 실패 시 만료 메시지와 함께 로그인 페이지로
    const response = NextResponse.redirect(
      addMessageToUrl(
        new URL('/', request.url),
        'auth-expired',
        '세션이 만료되었습니다. 다시 로그인해주세요.',
      ),
    );
    response.cookies.delete('Authorization');
    return response;
  }

  // 무효한 토큰인 경우
  const response = NextResponse.redirect(
    addMessageToUrl(
      new URL('/', request.url),
      'auth-invalid',
      '유효하지 않은 인증 정보입니다.',
    ),
  );
  response.cookies.delete('Authorization');
  return response;
}

/* -------------------------------------------------------------------------- */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};
