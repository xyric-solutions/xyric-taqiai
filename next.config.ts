import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: false,
  },
  // Stop the dev server from watching any database file.
  //  - data/judgments.db (+ -wal/-shm) and data/shc_pdfs churn during imports.
  //  - prisma/dev.db (+ -journal/-wal/-shm) is written on EVERY chat message
  //    (persistMessage in the AI Advisor). Without ignoring it, each send made
  //    the dev server recompile and spawn a worker process — the "white window"
  //    that flashed on every search.
  // All these DBs are accessed at runtime via their own connections (Prisma /
  // node:sqlite), never through the webpack module graph, so ignoring them from
  // the file-watcher changes nothing about how the app reads/writes them.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          "**/.git/**",
          "**/.next/**",
          "**/node_modules/**",
          "**/data/**",
          "**/prisma/**",
          "**/*.db",
          "**/*.db-journal",
          "**/*.db-wal",
          "**/*.db-shm",
        ],
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
