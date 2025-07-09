export function getPlatformLogo(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case 'netflix':
      return '/logos/netflix.jpg';
    case 'appletv':
      return '/logos/appletv.png';
    case 'tving':
      return '/logos/tving.jpg';
    case 'disney plus':
      return '/logos/disney.jpg';
    case 'wave':
      return '/logos/wave.jpg';
    case 'watcha':
      return '/logos/watcha.png';
    case 'coupangplay':
      return '/logos/coupangplay.png';
    // 필요한 플랫폼을 계속 추가…
    default:
      return undefined;
  }
}
