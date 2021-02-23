import React from 'react';
import { withKnobs, color, select } from '@storybook/addon-knobs';

import ActionButton from './ActionButton';

export default {
  title: 'ReportPage/ActionButton',
  component: 'ActionButton',
  decorators: [withKnobs],
};

export const Default = () => (
  <ActionButton
    style={{ color: color('color', '#000') }}
    theme={select('theme', ['dark', 'light'])}
  >
    Action button text
  </ActionButton>
);
