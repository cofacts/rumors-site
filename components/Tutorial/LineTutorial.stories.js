import React from 'react';
import { LineTutorialDesktop, LineTutorialMobile } from './LineTutorial';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Tutorial/LineTutorial',
  component: 'LineTutorial',
  decorators: [withKnobs],
};

export const desktop = () => <LineTutorialDesktop />;

export const mobile = () => (
  <div style={{ maxWidth: '500px' }}>
    <LineTutorialMobile />
  </div>
);
