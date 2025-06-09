import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.decrypt.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
