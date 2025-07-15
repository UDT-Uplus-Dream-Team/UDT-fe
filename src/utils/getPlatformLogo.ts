export function getPlatformLogo(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case '넷플릭스':
      return 'images/ott/netflix.png';
    case 'apple tv': // 소문자 + 공백 포함
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
    default:
      return undefined;
  }
}
