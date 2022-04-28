module.exports = {
  stories: ['../components/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-storysource',
  ],
  env: config => ({
    ...config,
    LOCALE: config.LOCALE ?? 'en_US',
  }),
};
