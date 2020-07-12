import React from 'react';
import Infos from './';
import { withKnobs, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Infos',
  component: 'Infos',
  decorators: [withKnobs],
};

export const PureText = () => <Infos>Some text</Infos>;

export const WithMultipleChildren = () => (
  <Infos>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
    {boolean('Show optional item (falsy children demo)', false) && (
      <span>Optional item</span>
    )}
  </Infos>
);
