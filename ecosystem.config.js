module.exports = {
  apps: [
    {
      name: 'customer-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/portion/Portion-client/frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        CHOKIDAR_USEPOLLING: 'true'
      }
    },
    {
      name: 'owner-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/portion/Portion/frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        CHOKIDAR_USEPOLLING: 'true'
      }
    },
    {
      name: 'backend',
      script: 'index.js',
      cwd: '/home/portion/Portion/backend',
      interpreter: 'node',
      env: {
        PORT: 5555,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 5555,
        NODE_ENV: 'production'
      }
    }
  ]
};
