// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Mengaktifkan static export murni
  images: {
    unoptimized: true, // Wajib agar next/image tidak membutuhkan server Node.js optimisasi
  },
};

export default nextConfig;