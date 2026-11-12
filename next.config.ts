import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
  turbopack: {},
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
