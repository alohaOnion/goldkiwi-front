import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const salesApiUrl =
  process.env.NEXT_PUBLIC_SALES_API_URL ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/sales/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/api/sales/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*",
        pathname: "/api/sales/uploads/**",
      },
      {
        protocol: "http",
        hostname: "*",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/sales/:path*", destination: `${salesApiUrl}/:path*` },
      { source: "/api/image/:path*", destination: `${salesApiUrl}/:path*` }, // 이미지는 sales 업로드 서버로
      { source: "/api/:path*", destination: `${apiUrl}/:path*` },
    ];
  },
};

export default nextConfig;
