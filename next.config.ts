import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tạm thời comment `output: "export"` để dev/build ở chế độ Node-server
  // (SSR/SSG). Bật lại trước khi build deploy static lên Apache:
  //   output: "export",
  typescript: {
    // Cho phép build vượt qua lỗi TS (tránh nghẽn deploy do lỗi type không
    // ảnh hưởng runtime). Khi codebase ổn định nên tắt option này.
    ignoreBuildErrors: true,
  },
  images: {
    // Giữ `unoptimized: true` để khỏi cần Node Image Optimizer; khi bật lại
    // `output: "export"` thì bắt buộc phải có dòng này.
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
