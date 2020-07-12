import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ListPageCards from './ListPageCards';
import ListPageCard from './ListPageCard';
import ArticleCard from './ArticleCard';

export default {
  title: 'ListPageDisplays/ListPageCards',
  component: 'ListPageCard',
  decorators: [withKnobs],
};

export const CardsAndCard = () => (
  <ListPageCards>
    {Array.from(Array(3)).map((_, idx) => (
      <ListPageCard key={idx}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu ex
        augue. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis
        a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam
        vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at
        luctus.
      </ListPageCard>
    ))}
  </ListPageCards>
);

export const ArticleCards = () => (
  <ListPageCards>
    <ArticleCard
      article={{
        id: 'id1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        replyCount: 3,
        replyRequestCount: 4,
        createdAt: '2020-01-01T00:00:00Z',
      }}
    />
    <ArticleCard
      article={{
        id: 'id2',
        text:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu ex augue. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at luctus.',
        replyCount: 0,
        replyRequestCount: 999,
        createdAt: '2019-01-01T00:00:00Z',
      }}
      query={text('Text to highlight on second ArticleCard', 'dolor sit amet')}
    />
  </ListPageCards>
);
