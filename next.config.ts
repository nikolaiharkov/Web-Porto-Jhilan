import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "/*": ["./foto/**", "./storage/**", "./data/**", "./seed/**"],
  },
};

export default nextConfig;
