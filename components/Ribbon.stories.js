import React from 'react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import Ribbon from './Ribbon';

export default {
  title: 'Ribbon',
  component: 'Ribbon',
  decorators: [withKnobs],
};

export const Default = () => (
  <div style={{ margin: 40, background: '#ccc' }}>
    Text content
    <Ribbon theme={select('theme', ['yellow', 'blue'], 'yellow')}>
      {text('ribbon children', 'ribbon children')}
    </Ribbon>
    Text content
  </div>
);
