module.exports = {
  apps: [
    {
      name: "web-service",
      script: "src/web/index.ts",
      watch: ["src/web"],
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
      name: "maintenance-service",
      script: "src/maintenance/index.ts",
      watch: ["src/maintenance"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
