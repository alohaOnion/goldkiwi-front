import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const salesApiUrl =
  process.env.NEXT_PUBLIC_SALES_API_URL ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/sales/:path*", destination: `${salesApiUrl}/:path*` },
      { source: "/api/:path*", destination: `${apiUrl}/:path*` },
    ];
  },
};

export default nextConfig;
