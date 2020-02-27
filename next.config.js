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
  webpack(config, { isServer }) {
    const originalEntryFn = config.entry;

    // Inserting polyfill for old Browsers
    // https://github.com/zeit/next.js/blob/canary/examples/with-polyfills/next.config.js
    config.entry = async () => {
      const entry = await originalEntryFn();
      if (entry['main.js'] && !entry['main.js'].includes('core-js')) {
        // As specified by React official doc
        // https://reactjs.org/docs/javascript-environment-requirements.html
        entry['main.js'].unshift('core-js');
      }
      return entry;
    };

    //
    // Simplified from https://github.com/twopluszero/next-images/blob/master/index.js
    //
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif|ico|webp|mp4)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/_next/static/images/',
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};
