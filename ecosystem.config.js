module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
