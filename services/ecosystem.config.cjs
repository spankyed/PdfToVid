module.exports = {
  apps: [
    {
      name: "client-service",
      script: "endpoints/client/index.ts",
      watch: ["endpoints/client"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "db-service",
      script: "endpoints/database/index.ts",
      watch: ["endpoints/database"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "worker-service",
      script: "endpoints/worker/index.ts",
      watch: ["endpoints/worker"],
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
