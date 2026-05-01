import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //output: "export",
  typescript: {
    //ignoreBuildErrors: true, // Thêm dòng này vào đây
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dkkxbcn56/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
