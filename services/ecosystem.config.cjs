module.exports = {
  apps: [
    {
      name: "Web",
      script: "src/web/server.ts",
      watch: ["src/web"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "Worker",
      script: "src/worker/server.ts",
      watch: ["src/worker"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "Maintenance",
      script: "src/maintenance/server.ts",
      watch: ["src/maintenance"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
