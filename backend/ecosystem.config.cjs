module.exports = {
  apps: [
    {
      name: 'ready-to-eat-backend',
      script: 'server.js',
      cwd: '/var/www/app/backend',
      exec_mode: 'fork',          // Required for single-core t2.micro stability
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
