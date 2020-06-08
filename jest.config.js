module.exports = {
  transform: {
    // Required by Storyshot multiSnapshotWithOptions()
    // Ref: https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#multisnapshotwithoptionsoptions
    //
    '^.+\\.stories\\.jsx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
