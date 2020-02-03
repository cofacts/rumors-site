module.exports = {
  apps: [
    {
      name: 'rumors-site',
      script: 'next start',
      instances: -2, // Spread to CPU -2 to reserve some for other uses
      exec_mode: 'cluster',
    },
  ],
};
