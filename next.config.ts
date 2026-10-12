import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Serve modern formats; next/image negotiates AVIF → WebP → JPEG.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
