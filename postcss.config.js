module.exports = () => ({
  plugins: {
    'postcss-color-function': {},
    'postcss-custom-media': {},
    'postcss-css-variables': {},

    // https://github.com/zeit/next.js/blob/master/examples/with-global-stylesheet/postcss.config.js
    //
    'postcss-easy-import': { prefix: '_' }, // keep this first
    autoprefixer: {
      /* ...options */
    }, // so imports are auto-prefixed too
  },
});
