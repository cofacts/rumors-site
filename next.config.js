const { parsed } = require('dotenv').config();

const env = {};
const publicRuntimeConfig = {};
const serverRuntimeConfig = {};

Object.keys(parsed || {}).forEach(key => {
  switch (true) {
    case key.startsWith('SERVER_'):
      serverRuntimeConfig[key] = process.env[key];
      break;
    case key.startsWith('PUBLIC_'):
      publicRuntimeConfig[key] = process.env[key];
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
