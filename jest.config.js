module.exports = {
  transform: {
    // Required by Storyshot multiSnapshotWithOptions()
    // Ref: https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#multisnapshotwithoptionsoptions
    //
    '^.+\\.stories\\.(j|t)sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // Ignore CSS and image imports in jest
    // Ref: https://jestjs.io/docs/en/webpack#handling-static-assets
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(png|jpg|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
