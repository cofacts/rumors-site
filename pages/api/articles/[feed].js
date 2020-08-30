import accepts from 'accepts';
import querystring from 'querystring';
import { t } from 'ttag';
import { Feed } from 'feed';
import { gql } from '@apollo/client';
import getConfig from 'next/config';
import { ellipsis } from 'lib/text';
import { createApolloClient } from 'lib/apollo';
import rollbar from 'lib/rollbar';
import { TYPE_NAME } from 'constants/replyType';
import JsonUrl from 'json-url';

const TITLE_LENGTH = 40;
const AVAILABLE_FEEDS = ['rss2', 'atom1', 'json1'];
const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

// This should match article "time" fields in ListArticleOrderBy
const IS_ARTICLE_TIME_FIELD = {
  createdAt: true,
  updatedAt: true,
  lastRequestedAt: true,
  lastRepliedAt: true,
};

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
          hyperlinks {
            url
            title
          }
          articleReplies(status: NORMAL) {
            replyId
            createdAt # IS_ARTICLE_TIME_FIELD
            user {
              name
            }
            reply {
              text
              type
              reference
            }
          }
          # IS_ARTICLE_TIME_FIELD
          createdAt
          updatedAt
          lastRequestedAt
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

/**
 * @param {object} article - article object from GraphQL
 * @param {string} dateField - article's first time field in orderBy
 * @return {string} date to fill in RSS <pubDate>
 */
function getDateValue(article, dateField) {
  if (dateField === 'lastRepliedAt') {
    return article.articleReplies[0].createdAt;
  }

  return article[dateField];
}

async function articleFeedHandler(req, res) {
  const {
    query: { feed, ...query },
  } = req;

  if (!AVAILABLE_FEEDS.includes(feed)) {
    res.status(400).send('Invalid feed type');
    return;
  }

  const lib = JsonUrl('lzma');
  const listQueryVars = await lib.decompress(query.json);

  const client = createApolloClient({
    /** @see https://www.apollographql.com/docs/apollo-server/monitoring/metrics/#identifying-distinct-clients */
    name: 'rumors-site RSS feed',
  });

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

  // first time field in article node specified in query
  const dateField =
    listQueryVars.orderBy.reduce((field, obj) => {
      if (field) return field;

      const [currentField] = Object.keys(obj);
      return IS_ARTICLE_TIME_FIELD[currentField] ? currentField : null;
    }, null) || 'createdAt';
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
        date: new Date(getDateValue(node, dateField)),
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
