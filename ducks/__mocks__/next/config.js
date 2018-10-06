/** In test environments, next.config.js is not used, thus we need to mock getConfig */

function getConfig() {
  return {
    publicRuntimeConfig: { PUBLIC_API_URL: 'API_URL', PUBLIC_APP_ID: 'APP_ID' },
  };
}

module.exports = getConfig;
