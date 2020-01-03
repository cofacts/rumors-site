import gql from 'graphql-tag';
import querystring from 'querystring';
import { t } from 'ttag';
import { Feed } from 'feed';
import { ApolloClient } from 'apollo-boost';
import getConfig from 'next/config';
import { ellipsis } from 'lib/text';
import { config } from 'lib/apollo';
import { getQueryVars } from 'pages/articles';

const TITLE_LENGTH = 40;
const AVAILABLE_FEEDS = ['rss2', 'atom1', 'json1'];
const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

// Arguments must match the ones in pages/articles.js
const LIST_ARTICLES = gql`
  query ListArticles(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
    $before: String
    $after: String
  ) {
    ListArticles(
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      first: 25
    ) {
      edges {
        node {
          id
          text
          createdAt
          hyperlinks {
            url
            title
          }
        }
      }
    }
  }
`;

function getArticleText({ text, hyperlinks }) {
  return (hyperlinks || []).reduce(
    (replacedText, hyperlink) =>
      hyperlink.title
        ? replacedText.replace(
            hyperlink.url,
            `[${hyperlink.title}](${hyperlink.url})`
          )
        : replacedText,
    text
  );
}

async function articleFeedHandler(req, res) {
  const {
    query: { feed, ...query },
  } = req;

  if (!AVAILABLE_FEEDS.includes(feed)) {
    res.status(400).send('Invalid feed type');
    return;
  }

  const listQueryVars = getQueryVars(query);

  const { createCache, ...otherConfigs } = config;
  const client = new ApolloClient({ ...otherConfigs, cache: createCache() });

  const { data, errors } = await client.query({
    query: LIST_ARTICLES,
    variables: listQueryVars,
  });
  if (errors && errors.length) {
    res.status(400).json(errors);
  }

  const queryString = querystring.stringify(query, '&amp;'); // Use &amp; for XML meta tags
  const feedOption = {
    title: (query.q ? `${query.q} | ` : '') + t`Cofacts reported messages`,
    link: `${PUBLIC_URL}/articles?${queryString}`,
    description: t`List of messages reported by Cofacts users`,
    feedLinks: {
      json: `${PUBLIC_URL}/api/articles/json1?${queryString}`,
      rss: `${PUBLIC_URL}/api/articles/rss2?${queryString}`,
      atom: `${PUBLIC_URL}/api/articles/atom1?${queryString}`,
    },
  };

  const feedInstance = new Feed(feedOption);

  data.ListArticles.edges.forEach(({ node }) => {
    const text = getArticleText(node);
    feedInstance.addItem({
      id: node.id,
      title: ellipsis(text, { wordCount: TITLE_LENGTH }),
      description: ellipsis(text, { wordCount: 200 }),
      link: `${PUBLIC_URL}/article/${node.id}`,
      date: new Date(node.createdAt),
    });
  });

  try {
    res.send(feedInstance[feed]());
  } catch (e) {
    res.status(500).send(e);
  }
}

export default articleFeedHandler;
