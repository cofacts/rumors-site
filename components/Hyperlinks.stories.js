import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import Hyperlinks, { POLLING_QUERY } from './Hyperlinks';

export default {
  title: 'Hyperlinks',
  component: 'Hyperlinks',
};

export const LoadedEmptyHyperlinks = () => <Hyperlinks hyperlinks={[]} />;

export const AllVariants = () => (
  <div style={{ padding: 16, background: '#fff' }}>
    <Hyperlinks
      hyperlinks={[
        {
          title: 'Lorum Ipsum - Demo Site',
          summary:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          url: 'https://cofacts.org',
        },
        {
          title: 'This site has image',
          summary: 'Summary is so short',
          topImageUrl: 'https://placekitten.com/400/300',
          url: 'https://cofacts.org',
        },
        {
          error: 'NOT_REACHABLE',
          url: 'https://not-found.org',
        },
      ]}
    />
  </div>
);

const POLLING_ID = 'foo';
const mocks = [
  // Polling mock, simulating hyperlinks still under processing (null)
  {
    request: {
      query: POLLING_QUERY.articles,
      variables: {
        id: POLLING_ID,
      },
    },
    result: {
      data: {
        GetArticle: {
          id: POLLING_ID,
          hyperlinks: null,
        },
      },
    },
  },
];

export const Polling = () => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <div style={{ padding: 16, background: '#fff' }}>
      <Hyperlinks
        hyperlinks={null}
        pollingType="articles"
        pollingId={POLLING_ID}
      />
    </div>
  </MockedProvider>
);
