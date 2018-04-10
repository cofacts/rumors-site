// https://github.com/zeit/next-plugins/tree/master/packages/next-css
//
const { config } = require('./package.json');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

let envConfig = {};

switch (process.env.BUILD_TARGET) {
  case 'production':
    envConfig = {
      API_URL: 'https://cofacts-api.g0v.tw',
      APP_ID: 'RUMORS_SITE',
      GA_TRACKER: 'UA-98468513-1',
    };
    break;

  case 'staging':
    envConfig = {
      API_URL: 'https://cofacts-api.hacktabl.org',
      APP_ID: 'RUMORS_SITE',
      GA_TRACKER: 'UA-98468513-5',
    };
    break;

  case 'local':
    // Own API server started using docker-compose in https://github.com/MrOrz/rumors-api
    envConfig = {
      API_URL: 'http://localhost:5000',
      APP_ID: 'DEV',
    };
    break;

  default:
    envConfig = {
      API_URL: 'https://cofacts-api.hacktabl.org', // Default to staging
      APP_ID: 'DEV',
    };
}

module.exports = withImages(
  withCSS({
    publicRuntimeConfig: {
      AUTOTRACK_FILENAME: config.autotrackFileName,
      ...envConfig,
    },
  })
);
