module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'server.js',
      instances: process.env.WEB_CONCURRENCY ? +process.env.WEB_CONCURRENCY : 2,
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
