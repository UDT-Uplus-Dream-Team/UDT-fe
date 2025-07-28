import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

interface CustomJWTPayload extends JoseJWTPayload {
  sub: string; // 사용자 ID
  ROLE: string; // 사용자 역할
  iat: number; // 발급 시간
  exp: number; // 만료 시간
}

// 역할별 접근 제한 설정 (제외할 경로)
const ROLE_RESTRICTIONS = {
  ROLE_GUEST: {
    allowed: ['/survey'], // GUEST는 survey만 접근 가능
    denied: [], // 나머지 모든 경로 차단
  },
  ROLE_USER: {
    allowed: [], // 모든 경로 접근 가능 (denied 제외)
    denied: ['/survey', '/admin'], // survey, admin 접근 차단
  },
  ROLE_ADMIN: {
    allowed: [], // 모든 경로 접근 가능 (denied 제외)
    denied: ['/survey'], // survey만 접근 차단
  },
} as const;

// 공개 경로 (인증 불필요)
const PUBLIC_PATHS = [
  '/', // 루트 경로만 공개
  '/_next', // Next.js 내부 파일들
  '/favicon.ico',
  '/images', // 이미지 파일들
  '/icons',
];

// JWT 시크릿 키 (환경변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * JWT 토큰 검증 함수
 */
async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // payload 타입 확인 및 변환
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
    console.error('JWT 검증 실패:', error);
    return null;
  }
}

/**
 * 경로가 공개 경로인지 확인
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * 역할에 따른 경로 접근 권한 확인
 */
function hasPermission(role: string, pathname: string): boolean {
  const restrictions =
    ROLE_RESTRICTIONS[role as keyof typeof ROLE_RESTRICTIONS];

  if (!restrictions) {
    return false;
  }

  // GUEST의 경우: allowed 목록에 있는 경로만 접근 가능
  if (role === 'ROLE_GUEST') {
    return restrictions.allowed.some((path) => pathname.startsWith(path));
  }

  // USER, ADMIN의 경우: denied 목록에 없으면 접근 가능
  return !restrictions.denied.some((path) => pathname.startsWith(path));
}

/**
 * 메인 미들웨어 함수
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로는 미들웨어 통과
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Cookie에서 토큰 추출
  const token = request.cookies.get('Authorization')?.value;

  // 토큰이 없는 경우 - 루트 경로로만 이동 가능
  if (!token) {
    console.warn('토큰이 없습니다. 루트 경로로 리다이렉트');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 토큰 검증
  const payload = await verifyToken(token);

  if (!payload) {
    console.warn('유효하지 않은 토큰. 루트 경로로 리다이렉트');
    // 유효하지 않은 토큰인 경우 쿠키 삭제
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('Authorization');
    return response;
  }

  // 토큰 만료 확인
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp < currentTime) {
    console.warn('토큰이 만료되었습니다. 루트 경로로 리다이렉트');
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('Authorization');
    return response;
  }

  // 이미 로그인된 상태에서 루트 경로 접근 시 자연스러운 리다이렉트
  if (pathname === '/') {
    let defaultPath: string;
    switch (payload.ROLE) {
      case 'ROLE_GUEST':
        defaultPath = '/survey';
        break;
      case 'ROLE_ADMIN':
        defaultPath = '/admin';
        break;
      case 'ROLE_USER':
      default:
        defaultPath = '/recommend';
        break;
    }
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  // 역할별 권한 확인
  if (!hasPermission(payload.ROLE, pathname)) {
    console.warn(`권한이 없습니다. 역할: ${payload.ROLE}, 경로: ${pathname}`);

    // 권한이 없는 경우 역할별 기본 페이지로 리다이렉트
    let defaultPath: string;
    switch (payload.ROLE) {
      case 'ROLE_GUEST':
        defaultPath = '/survey';
        break;
      case 'ROLE_ADMIN':
        defaultPath = '/admin';
        break;
      case 'ROLE_USER':
      default:
        defaultPath = '/recommend';
        break;
    }

    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return NextResponse.next();
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - api (일부 공개 API 제외)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (개발환경 Hot Module Replacement)
     * - favicon.ico, manifest files
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|manifest|robots.txt|sitemap).*)',
  ],
};
