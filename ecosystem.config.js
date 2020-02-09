module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
