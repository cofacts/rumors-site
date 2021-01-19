import React from 'react';
import LineTutorial from './LineTutorial';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Tutorial/LineTutorial',
  component: 'LineTutorial',
  decorators: [withKnobs],
};

export const normal = () => <LineTutorial />;
