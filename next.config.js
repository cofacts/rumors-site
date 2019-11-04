require('dotenv').config();

const env = {};
const publicRuntimeConfig = {};
const serverRuntimeConfig = {};

Object.keys(process.env || {}).forEach(key => {
  switch (true) {
    case key.startsWith('SERVER_'):
      serverRuntimeConfig[key] = process.env[key];
      break;
    case key.startsWith('PUBLIC_'):
      publicRuntimeConfig[key] = process.env[key];
      break;
    case key.startsWith('NODE_'):
    case key.startsWith('__'):
    case key.startsWith('npm_'):
    case key === 'PATH':
    case key === 'NODE':
      // https://github.com/zeit/next.js/blob/master/errors/env-key-not-allowed.md
      break;
    default:
      env[key] = process.env[key];
  }
});

module.exports = {
  env,
  publicRuntimeConfig,
  serverRuntimeConfig,
};
