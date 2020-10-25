import React from 'react';
import InputBox from './InputBox';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'LandingPage/InputBox',
  component: 'InputBox',
  decorators: [withKnobs],
};

const tags = ['aaaaa', 'bbbbb', 'ccccc', 'ddddd'];

export const normal = () => (
  <div style={{ width: '400px' }}>
    <InputBox
      value={text('value', 'text')}
      tags={tags}
      onChange={action('onChange')}
    />
  </div>
);
