module.exports = {
  apps: [
    {
      name: "client-service",
      script: "src/web/index.ts",
      watch: ["src/web"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "database-service",
      script: "src/database/index.ts",
      watch: ["src/database"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "worker-service",
      script: "src/worker/index.ts",
      watch: ["src/worker"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "status-service",
      script: "src/status/index.ts",
      watch: ["src/status"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
