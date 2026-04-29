import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dkkxbcn56/image/upload/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
