require('dotenv').config();
const path = require('path');

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

// Format of HTTP_HEADERS: see https://github.com/vercel/next.js/blob/v9.5.3/docs/api-reference/next.config.js/headers.md

let headers = [];
try {
  headers = JSON.parse(process.env.HTTP_HEADERS || '[]');
} catch (err) {
  console.error('[next.config] Invalid HTTP_HEADERS', err);
}

module.exports = {
  env,
  publicRuntimeConfig,
  serverRuntimeConfig,
  webpack(config, { isServer, defaultLoaders }) {
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

    if (!isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: [path.resolve(__dirname, 'node_modules', 'react-spring')],
        use: [defaultLoaders.babel],
      });
    }

    return config;
  },
  headers: () => headers,
};
