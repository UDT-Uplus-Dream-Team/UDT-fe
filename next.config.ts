import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
    // 또는 더 간단한 domains 방식 (deprecated되었지만 여전히 작동)
    domains: ['image.tmdb.org'],
  },
};

export default nextConfig;
