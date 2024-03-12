module.exports = {
  apps: [
    {
      name: "Web",
      script: "src/web/index.ts",
      watch: ["src/web"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "Worker",
      script: "src/worker/index.ts",
      watch: ["src/worker"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "Maintenance",
      script: "src/maintenance/index.ts",
      watch: ["src/maintenance"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
