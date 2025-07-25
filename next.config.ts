import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['s3-udt-dev.s3.ap-northeast-2.amazonaws.com'],
  },
};

export default nextConfig;
module.exports = nextConfig;
