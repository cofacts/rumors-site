/**
 * Configs used in both clients and the server.
 * Please DON'T PUT ANY SERVER CREDENTIALS here because it's going to be bundled in client JS.
 */

import { config } from './package.json';

const common = {
  AUTOTRACK_FILENAME: config.autotrackFileName,
  API_URL: 'https://cofacts-api.hacktabl.org', // Default to staging
  APP_ID: 'DEV',
};

switch (process.env.BUILD_TARGET) {
  case 'production':
    module.exports = {
      ...common,
      API_URL: 'https://cofacts-api.g0v.tw',
      APP_ID: 'RUMORS_SITE',
      GA_TRACKER: 'UA-98468513-1',
    };
    break;

  case 'staging':
    module.exports = {
      ...common,
      API_URL: 'https://cofacts-api.hacktabl.org',
      APP_ID: 'RUMORS_SITE',
      GA_TRACKER: 'UA-98468513-5',
    };
    break;

  case 'local':
    // Own API server started using docker-compose in https://github.com/MrOrz/rumors-api
    module.exports = {
      ...common,
      API_URL: 'http://localhost:5000',
    };
    break;

  default:
    module.exports = common;
}
