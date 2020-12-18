import React from 'react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { UpgradeDialogLayout } from './UpgradeDialog';

export default {
  title: 'UpgradeDialog',
  component: 'UpgradeDialog',
  decorators: [withKnobs],
};

export const Default = () => (
  <UpgradeDialogLayout
    stage={number('stage', 0, {
      range: true,
      step: 1,
      min: 0,
      max: 4,
    })}
    open={boolean('open', false)}
    currentLevel={18}
    currentLevelScore={100}
    nextLevel={19}
    nextLevelScore={200}
    onClose={action('onClose')}
  />
);
