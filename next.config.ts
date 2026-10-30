import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "/*": ["./foto/**", "./storage/**", "./data/**", "./seed/**"],
  },
  typescript: {
    // tsc dijalankan terpisah di Dockerfile sebelum bundling.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
