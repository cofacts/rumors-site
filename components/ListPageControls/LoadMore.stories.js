import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import LoadMore from './LoadMore';

export default {
  title: 'ListPageControls/LoadMore',
  component: 'LoadMore',
  decorators: [withKnobs],
};

export const ShowsUp = () => (
  <LoadMore
    edges={[
      {
        cursor: 'foo',
      },
    ]}
    pageInfo={{ lastCursor: 'bar' }}
    loading={boolean('loading', false)}
    onMoreRequest={action('onMoreRequest')}
  />
);

export const ShowsNothing = () => (
  <>
    <p>Render nothing when no edges</p>
    <LoadMore edges={[]} />
    <p>Render nothing when last edge is reached</p>
    <LoadMore
      edges={[
        {
          cursor: 'foo',
        },
      ]}
      pageInfo={{ lastCursor: 'foo' }}
    />
  </>
);
