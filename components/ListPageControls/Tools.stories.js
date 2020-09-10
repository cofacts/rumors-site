import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import Tools from './Tools';

export default {
  title: 'ListPageControls/Tools',
  component: 'Tools',
  decorators: [withKnobs],
};

export const Header = () => (
  <Tools>
    <div>{text('Tool 1', 'Tool #1 control')}</div>
    <div>{text('Tool 2', 'Tool #2 control')}</div>
  </Tools>
);
