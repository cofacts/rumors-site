import React from 'react';
import ProfileLink from './ProfileLink';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

export default {
  title: 'ProfileLink',
  component: 'ProfileLink',
  decorators: [withKnobs],
};

export const RendersChildWhenNoUser = () => <ProfileLink>Child</ProfileLink>;

export const AllProps = () => {
  const MOCK_USER = {
    level: number('user level', 10),
    slug: text('user slug', 'slug123'),
    id: text('user id', '123'),
  };

  return (
    <ProfileLink user={MOCK_USER} hasTooltip={boolean('hasTooltip', true)}>
      <span>Child</span>
    </ProfileLink>
  );
};
