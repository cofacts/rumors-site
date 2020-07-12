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
    <span>Item in span</span>
    {/* Pure text between spans */} Item in text<span>Item in span 2</span>
    {/* Pure text between spans */}
    {boolean('Show optional item (falsy children demo)', false) && (
      <span>Optional item</span>
    )}
    <>
      {/* Fragment considered as 1 item */}
      Item <em>wrapped</em> in fragment
    </>
  </Infos>
);
