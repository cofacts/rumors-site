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

module.exports = {
  env,
  publicRuntimeConfig,
  serverRuntimeConfig,
  webpack(config, { isServer, defaultLoaders }) {
    //
    // Simplified from https://github.com/twopluszero/next-images/blob/master/index.js
    //
    config.module.rules.push(
      {
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
      },
      {
        // Langfuse SDK
        test: /node_modules\/langfuse/,
        type: 'javascript/auto', // https://stackoverflow.com/a/74957466/1582110
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      }
    );

    if (!isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: [path.resolve(__dirname, 'node_modules', 'react-spring')],
        use: [defaultLoaders.babel],
      });
    }

    return config;
  },
};
