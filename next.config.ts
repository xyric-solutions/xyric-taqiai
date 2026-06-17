import type { NextConfig } from "next";

// Dev-only webpack file-watcher tuning. Stops the dev server (`npm run
// dev:webpack`) from watching database files:
//  - data/judgments.db (+ -wal/-shm) and data/shc_pdfs churn during imports.
//  - prisma/dev.db (+ -journal/-wal/-shm) is written on EVERY chat message
//    (persistMessage in the AI Advisor). Without ignoring it, each send made
//    the dev server recompile — the "white window" that flashed on every search.
// All these DBs are read/written at runtime via their own connections (Prisma /
// node:sqlite), never through the webpack module graph, so ignoring them from
// the file-watcher changes nothing about how the app reads/writes them.
//
// IMPORTANT: this key is included ONLY in development. Next 16 builds with
// Turbopack and errors when a `webpack` config exists; keeping it out of the
// production build entirely (not just adding `turbopack: {}`) avoids that.
const isDev = process.env.NODE_ENV === "development";

const devWebpack: NextConfig["webpack"] = (config, { dev }) => {
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
};

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: false,
  },
  turbopack: {},
  ...(isDev ? { webpack: devWebpack } : {}),
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
