import accepts from 'accepts';
import gql from 'graphql-tag';
import querystring from 'querystring';
import { t } from 'ttag';
import { Feed } from 'feed';
import { ApolloClient } from 'apollo-boost';
import getConfig from 'next/config';
import { ellipsis } from 'lib/text';
import { config } from 'lib/apollo';
import rollbar from 'lib/rollbar';
import { getQueryVars } from 'pages/articles';
import { TYPE_NAME } from 'constants/replyType';

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
      first: 10
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
          articleReplies(status: NORMAL) {
            replyId
            user {
              name
            }
            reply {
              text
              type
              reference
            }
          }
        }
      }
    }
  }
`;

/**
 * Extracts text and replaces hyperlinks with title information for better readability
 *
 * @param {object} node - Article node in GraphQL API
 * @returns {string}
 */
function getArticleText({ text, hyperlinks }) {
  return (hyperlinks || []).reduce(
    (replacedText, hyperlink) =>
      hyperlink.title
        ? replacedText.replace(
            hyperlink.url,
            `${hyperlink.url} (${hyperlink.title})`
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
    return;
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

  try {
    data.ListArticles.edges.forEach(({ node }) => {
      const text = getArticleText(node);
      const url = `${PUBLIC_URL}/article/${node.id}`;
      const articleReply = node.articleReplies[0];
      feedInstance.addItem({
        id: url,
        title: ellipsis(text, { wordCount: TITLE_LENGTH }),

        // https://stackoverflow.com/a/54905457/1582110
        description:
          `
          <h2><a href="${url}">${t`Reported Message`}</a></h2>
          ${text}
        ` +
          (articleReply
            ? `
              <h2><a href="${PUBLIC_URL}/reply/${
                articleReply.replyId
              }">${t`Latest reply`}</a></h2>
              <p>${TYPE_NAME[articleReply.reply.type]} by ${
                articleReply.user ? articleReply.user.name : t`someone`
              }</p>
              ${articleReply.reply.text}

              ${articleReply.reply.reference ? `<h2>${t`Reference`}</h2>` : ''}
              ${articleReply.reply.reference}
            `
            : ''),

        link: url,
        date: new Date(node.createdAt),
      });
    });

    // https://stackoverflow.com/questions/595616/what-is-the-correct-mime-type-to-use-for-an-rss-feed
    const type = accepts(req).type([
      'application/rss+xml',
      'application/xml',
      'text/xml',
    ]);
    res.setHeader('Content-Type', type || 'text/xml');
    res.send(feedInstance[feed]());
  } catch (e) {
    rollbar.error(e);
    res.status(500).json(e);
  }
}

export default articleFeedHandler;
