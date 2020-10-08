module.exports = {
  transform: {
    // Required by Storyshot multiSnapshotWithOptions()
    // Ref: https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#multisnapshotwithoptionsoptions
    //
    '^.+\\.stories\\.jsx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // Ignore CSS imports in jest
    // Ref: https://jestjs.io/docs/en/webpack#handling-static-assets
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
};
