// 플랫폼 로고 이미지 반환 함수
export function getPlatformLogo(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case '넷플릭스':
      return '/images/ott/netflix.webp';
    case '티빙':
      return '/images/ott/tving.webp';
    case '디즈니+':
      return '/images/ott/disneyPlus.webp';
    case '웨이브':
      return '/images/ott/wavve.webp';
    case '왓챠':
      return '/images/ott/watcha.webp';
    case '쿠팡플레이':
      return '/images/ott/coupangPlay.webp';
    default:
      return undefined;
  }
}
