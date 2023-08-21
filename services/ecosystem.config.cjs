module.exports = {
  apps: [
    {
      name: "client-service",
      script: "endpoints/client/index.ts",
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "db-service",
      script: "endpoints/database/index.ts",
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
    {
      name: "worker-service",
      script: "endpoints/worker/index.ts",
      interpreterArgs: '--loader tsx',
      interpreter: 'node',
    },
  ],
};
