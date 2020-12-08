import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { UpgradeDialogLayout } from './UpgradeDialog';

export default {
  title: 'UpgradeDialog',
  component: 'UpgradeDialog',
  decorators: [withKnobs],
};

export const Default = () => (
  <UpgradeDialogLayout
    open={boolean('open', false)}
    prevLevel={1}
    prevLevelScore={100}
    nextLevel={2}
    nextLevelScore={200}
    onClose={action('onClose')}
  />
);
