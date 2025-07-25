import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['s3-udt-dev.s3.ap-northeast-2.amazonaws.com'],
  },
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;
