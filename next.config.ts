import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.1.136", "http://localhost:3000", "https://localhost:3000"],
};

export default nextConfig;
