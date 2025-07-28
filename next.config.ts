// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['jose'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-udt-dev.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**', // S3의 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        pathname: '/**', // 카카오 CDN 이미지 경로 허용
      },
    ],
  },
};

export default nextConfig;
