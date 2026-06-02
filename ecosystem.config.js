module.exports = {
  apps: [
    {
      name: "legal-ai",
      cwd: "d:/AI legal System/ai-legal-system",
      script: "node_modules/next/dist/bin/next",
      args: "dev --webpack --hostname 0.0.0.0",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "3G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=4096",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
      min_uptime: "15s",
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
