import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
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
        articleType: 'TEXT',
      }}
    />
    <ArticleCard
      article={{
        id: 'id2',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu ex augue. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at luctus.',
        replyCount: 0,
        replyRequestCount: 999,
        createdAt: '2019-01-01T00:00:00Z',
        articleType: 'TEXT',
      }}
      highlight={{
        text: '<HIGHLIGHT>Lorem ipsum</HIGHLIGHT> dolor sit amet, consectetur adipiscing elit. <HIGHLIGHT>Mauris eu ex augue</HIGHLIGHT>. Etiam posuere sagittis iaculis. Vestibulum sollicitudin nec felis a mollis. Phasellus ut est velit. Proin fermentum arcu ornare quam vulputate, vel eleifend velit ultrices. Fusce tincidunt vel urna at luctus.',
        hyperlinks: [
          {
            title: '<HIGHLIGHT>Lorem ipsum</HIGHLIGHT> dolor sit amet',
            summary:
              '<HIGHLIGHT>Mauris eu ex augue</HIGHLIGHT>. Etiam posuere sagittis iaculis.',
          },
        ],
      }}
    />
    <ArticleCard
      article={{
        id: 'id3',
        thumbnailUrl: 'https://placekitten.com/512/1000',
        replyCount: 6,
        replyRequestCount: 4,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'IMAGE',
      }}
    />
    <ArticleCard
      article={{
        id: 'id3',
        thumbnailUrl: 'https://placekitten.com/2000/150',
        replyCount: 4,
        replyRequestCount: 6,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'IMAGE',
      }}
    />
    <ArticleCard
      article={{
        id: 'id4',
        thumbnailUrl: null,
        replyCount: 0,
        replyRequestCount: 0,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'VIDEO',
      }}
    />
    <ArticleCard
      article={{
        id: 'id5',
        thumbnailUrl:
          'https://drive.google.com/uc?id=1SQ9lc1-ghzw-SL6Dyb_UMN6hAPBAckvK&confirm=t',
        replyCount: 0,
        replyRequestCount: 0,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'VIDEO',
      }}
    />
    <ArticleCard
      article={{
        id: 'id6',
        thumbnailUrl:
          'https://drive.google.com/uc?id=1DczThMYTmGV3GvDCAU2EPnhsBwVcoFQi&confirm=t',
        replyCount: 0,
        replyRequestCount: 0,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'VIDEO',
      }}
    />
    <ArticleCard
      article={{
        id: 'id6',
        thumbnailUrl:
          'https://drive.google.com/uc?id=1D-K8hVcOw7UNbu80uJkAYMJd1HilAFOp&confirm=t',
        replyCount: 0,
        replyRequestCount: 0,
        createdAt: '2020-01-01T00:00:00Z',
        articleType: 'AUDIO',
      }}
    />
  </ListPageCards>
);
