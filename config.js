import { config } from './package.json';

module.exports = {
  API_URL: process.env.USE_LOCAL
    ? 'http://localhost:5000'
    : 'https://cofacts-api.g0v.tw',

  // If is dev but connet to production api, don't use appId = RUMORS_SITE.
  // Use RUMORS_SITE only on production, or when connecting to local dev server
  //
  APP_ID: process.env.USE_LOCAL || process.env.NODE_ENV === 'production'
    ? 'RUMORS_SITE'
    : 'DEV',
  GA_TRACKER: 'UA-98468513-1',
  AUTOTRACK_FILENAME: config.autotrackFileName,
};
