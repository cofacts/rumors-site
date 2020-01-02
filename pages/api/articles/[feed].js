import gql from 'graphql-tag';
import { t } from 'ttag';
import { ApolloClient } from 'apollo-boost';
import { ellipsis } from 'lib/text';
import { config } from 'lib/apollo';
import { Feed } from 'feed';

const TITLE_LENGTH = 40;
const AVAILABLE_FEEDS = ['rss2', 'atom1', 'json1'];

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
    query: { feed, args },
  } = req;

  if (!AVAILABLE_FEEDS.includes(feed)) {
    res.status(400).send('Invalid feed type');
    return;
  }

  let variables;
  try {
    variables = JSON.parse(args || '{}');
    if (typeof variables !== 'object')
      throw Error('args should be an JSON object');
  } catch (e) {
    res.status(400).send(`Error parsing args: ${e}`);
    return;
  }

  const { createCache, ...otherConfigs } = config;
  const client = new ApolloClient({ ...otherConfigs, cache: createCache() });

  const { data, errors } = await client.query({
    query: LIST_ARTICLES,
    variables,
  });
  if (errors && errors.length) {
    res.status(400).json(errors);
  }

  const keywords = args?.filter?.moreLikeThis?.like;
  const feedOption = {
    title: (keywords ? `${keywords} | ` : '') + t`Cofacts reported messages`,
    link: 'https://cofacts.g0v.tw/articles',
    description: t`List of messages reported by Cofacts users`,
    feedLinks: {
      json: `https://cofacts.g0v.tw/api/articles/json1?args=${args}`,
      rss: `https://cofacts.g0v.tw/api/articles/rss2?args=${args}`,
      atom: `https://cofacts.g0v.tw/api/articles/atom1?args=${args}`,
    },
  };

  const feedInstance = new Feed(feedOption);

  data.ListArticles.edges.forEach(({ node }) => {
    const text = getArticleText(node);
    feedInstance.addItem({
      id: node.id,
      title: ellipsis(text, { wordCount: TITLE_LENGTH }),
      description: ellipsis(text, { wordCount: 200 }),
      link: `https://cofacts.g0v.tw/article/${node.id}`,
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
