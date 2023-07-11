module.exports = {
  stories: ['../components/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource',
  ],
  env: (config) => ({
    ...config,
    LOCALE: config.LOCALE ?? 'en_US',
  }),
};
