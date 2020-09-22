import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ListPageHeader from './ListPageHeader';

export default {
  title: 'ListPageDisplays/ListPageHeader',
  component: 'ListPageHeader',
  decorators: [withKnobs],
};

export const Header = () => (
  <ListPageHeader title={text('title', 'Header text')}>
    {text('children', 'children content')}
  </ListPageHeader>
);
