import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

/* -------------------------------------------------------------------------- */
/* 타입                                                                      */
/* -------------------------------------------------------------------------- */
interface CustomJWTPayload extends JoseJWTPayload {
  sub: string;
  ROLE: string;
  iat: number;
  exp: number;
}

interface TokenVerificationResult {
  payload: CustomJWTPayload | null;
  isExpired: boolean;
  isInvalid: boolean;
}

interface ReissueResult {
  ok: boolean;
  setCookie?: string;
}

/* -------------------------------------------------------------------------- */
/* 상수                                                                      */
/* -------------------------------------------------------------------------- */
const PUBLIC_PATHS = ['/_next', '/favicon.ico', '/fonts', '/images', '/icons'];

// ADMIN 역할 제거 - ROLE_USER와 ROLE_GUEST만 허용
const ROLE_RESTRICTIONS = {
  ROLE_GUEST: {
    allowed: ['/survey'],
    denied: [],
  },
  ROLE_USER: {
    allowed: [],
    denied: ['/survey'],
  },
} as const;

// 허용된 역할 목록
const ALLOWED_ROLES = ['ROLE_USER', 'ROLE_GUEST'] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/* -------------------------------------------------------------------------- */
/* 유틸 함수                                                                  */
/* -------------------------------------------------------------------------- */
function addMessageToUrl(url: URL, type: string, message: string): URL {
  const encodedMessage = Buffer.from(message, 'utf-8').toString('base64');
  url.searchParams.set('auth_msg', type);
  url.searchParams.set('auth_text', encodedMessage);
  return url;
}

function isStaticPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

// 역할이 허용된 역할인지 확인
function isValidRole(role: string): role is AllowedRole {
  return ALLOWED_ROLES.includes(role as AllowedRole);
}

function hasPermission(role: string, pathname: string): boolean {
  // 허용되지 않은 역할인 경우 접근 거부
  if (!isValidRole(role)) {
    return false;
  }

  const restrictions = ROLE_RESTRICTIONS[role];

  // GUEST의 경우: allowed 목록에 있는 경로만 접근 가능
  if (role === 'ROLE_GUEST') {
    const hasAccess = restrictions.allowed.some((path) =>
      pathname.startsWith(path),
    );
    return hasAccess;
  }

  // USER의 경우: denied 목록에 없으면 접근 가능
  if (role === 'ROLE_USER') {
    const isDenied = restrictions.denied.some((path) =>
      pathname.startsWith(path),
    );
    return !isDenied;
  }

  return false;
}

function getDefaultPath(role: string): string {
  switch (role) {
    case 'ROLE_GUEST':
      return '/survey';
    case 'ROLE_USER':
      return '/recommend';
    default:
      // 허용되지 않은 역할의 경우 루트로 이동
      return '/';
  }
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
      // 허용되지 않은 역할인 경우 무효한 토큰으로 처리
      if (!isValidRole(payload.ROLE)) {
        console.warn(`Invalid role detected: ${payload.ROLE}`);
        return {
          payload: null,
          isExpired: false,
          isInvalid: true,
        };
      }

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
  } catch (error: unknown) {
    console.error('JWT VERIFICATION FAILED:', error);

    // jose 라이브러리의 만료 에러 감지
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ERR_JWT_EXPIRED'
    ) {
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
/* 토큰 재발급 - Authorization 쿠키를 포함한 전체 쿠키 헤더 전달                */
/* -------------------------------------------------------------------------- */
async function reissueToken(request: NextRequest): Promise<ReissueResult> {
  try {
    console.log('토큰 재발급');
    console.log('API_BASE_URL:', API_BASE_URL);

    const cookieHeader = request.headers.get('cookie') || '';
    console.log('Cookie Header:', cookieHeader);

    const response = await fetch(`${API_BASE_URL}/api/auth/reissue/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader, // Authorization 쿠키가 포함된 전체 헤더 전달
      },
    });
    if (response.status === 204) {
      return {
        ok: true,
        setCookie: response.headers.get('set-cookie') || undefined,
      };
    }
    console.log('error:', response.status);
    return { ok: false };
  } catch (error) {
    console.error('error', error);
    return { ok: false };
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
      const defaultPath = getDefaultPath(verification.payload.ROLE);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    if (verification.isExpired) {
      // 만료된 토큰이면 재발급 시도
      const { ok, setCookie } = await reissueToken(request);

      if (ok) {
        // 재발급 성공 시 같은 경로로 리다이렉트
        const response = NextResponse.redirect(new URL('/', request.url));
        if (setCookie) {
          response.headers.set('set-cookie', setCookie);
        }
        return response;
      }
    }

    // 재발급 실패하거나 무효한 토큰인 경우 쿠키 삭제하고 메인 페이지 유지
    const response = NextResponse.next();
    response.cookies.delete('Authorization');
    return response;
  }

  /* -------- 비로그인 상태 -------- */
  if (!token) {
    const redirectUrl = addMessageToUrl(
      new URL('/', request.url),
      'auth-required',
      '로그인이 필요합니다.',
    );
    return NextResponse.redirect(redirectUrl);
  }

  /* -------- 토큰 검증 -------- */
  const verification = await verifyToken(token);

  if (verification.payload) {
    // 유효한 토큰이 있는 경우 권한 체크
    if (!hasPermission(verification.payload.ROLE, pathname)) {
      const defaultPath = getDefaultPath(verification.payload.ROLE);
      const redirectUrl = addMessageToUrl(
        new URL(defaultPath, request.url),
        'access-denied',
        '잘못된 접근입니다.',
      );
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (verification.isExpired) {
    // 만료된 토큰이면 재발급 시도
    const { ok, setCookie } = await reissueToken(request);

    if (ok) {
      // 재발급 성공 시 같은 경로로 리다이렉트하되,
      // 재발급된 토큰의 역할도 다시 검증해야 함
      const response = NextResponse.redirect(new URL(pathname, request.url));
      if (setCookie) {
        response.headers.set('set-cookie', setCookie);
      }
      return response;
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

  // 무효한 토큰인 경우 (허용되지 않은 역할 포함)
  const response = NextResponse.redirect(
    addMessageToUrl(
      new URL('/', request.url),
      'auth-invalid',
      '유효하지 않은 인증 정보입니다. 다시 로그인해주세요.',
    ),
  );
  response.cookies.delete('Authorization');
  return response;
}

/* -------------------------------------------------------------------------- */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};
