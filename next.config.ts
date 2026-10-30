import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  typescript: {
    // Type check dijalankan sebagai langkah build terpisah di Dockerfile
    // agar tidak menumpuk memori bersama proses bundling di host 1 GB.
    ignoreBuildErrors: true,
  },
  outputFileTracingExcludes: {
    "/*": ["./foto/**", "./storage/**", "./data/**", "./seed/**"],
  },
};

export default nextConfig;
