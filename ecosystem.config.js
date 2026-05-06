module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'server.js',
      instances: process.env.WEB_CONCURRENCY ? +process.env.WEB_CONCURRENCY : 1,
      exec_mode: 'cluster',
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
};
