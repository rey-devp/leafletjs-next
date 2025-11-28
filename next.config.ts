import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
