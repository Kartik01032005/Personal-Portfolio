import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@radix-ui/react-icons",
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Use memory cache in dev: eliminates OneDrive file-locking ENOENT pack errors
      // while preserving React Server Component client manifest module mappings
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
};

export default nextConfig;
