import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io', // ImageKit hostname
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery', // Replicate hostname
        pathname: '/**',
      },
      // Add any other image hosts you use
    ],
  },
};

export default nextConfig;
