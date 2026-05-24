import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js automatically detects src/ directory — no extra config needed.

  // Keep active pages warm for longer in dev to reduce recompiles.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 8,
  },

  experimental: {
    // Persist Turbopack cache between runs for faster startup.
    turbopackFileSystemCacheForDev: true,
    // Reuse cached Server Component fetch responses across HMR refreshes.
    serverComponentsHmrCache: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
