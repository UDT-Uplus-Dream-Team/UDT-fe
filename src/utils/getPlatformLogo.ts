export function getPlatformLogo(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case '넷플릭스':
      return 'images/ott/netflix.png';
    case '애플티비+':
      return 'images/ott/appleTv.png';
    case '티빙':
      return 'images/ott/tving.png';
    case '디즈니+':
      return 'images/ott/disneyPlus.png';
    case '웨이브':
      return 'images/ott/wavve.png';
    case '왓챠':
      return 'images/ott/watcha.png';
    case '쿠팡플레이':
      return 'images/ott/coupangPlay.png';
    // 필요한 플랫폼을 계속 추가…
    default:
      return undefined;
  }
}
