export function getPlatformLogo(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case 'netflix':
      return 'images/ott/netflix.png';
    case 'appletv':
      return 'images/ott/appleTv.png';
    case 'tving':
      return 'images/ott/tving.png';
    case 'disney plus':
      return 'images/ott/disneyPlus.png';
    case 'wavve':
      return 'images/ott/wavve.png';
    case 'watcha':
      return 'images/ott/watcha.png';
    case 'coupangplay':
      return 'images/ott/coupangPlay.png';
    // 필요한 플랫폼을 계속 추가…
    default:
      return undefined;
  }
}
