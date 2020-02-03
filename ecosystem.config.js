module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
