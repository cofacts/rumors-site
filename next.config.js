require('dotenv').config();

// https://github.com/zeit/next-plugins/tree/master/packages/next-css
//
const { config } = require('./package.json');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

const publicRuntimeConfig = {};
const serverRuntimeConfig = {};

Object.keys(process.env).forEach(key => {
  switch (true) {
    case key.startsWith('SERVER_'):
      serverRuntimeConfig[key] = process.env[key];
      break;
    case key.startsWith('PUBLIC_'):
      publicRuntimeConfig[key] = process.env[key];
      break;
    default:
  }
});

module.exports = withImages(
  withCSS({
    publicRuntimeConfig: {
      ...publicRuntimeConfig,
      AUTOTRACK_FILENAME: config.autotrackFileName,
    },
    serverRuntimeConfig,
  })
);
