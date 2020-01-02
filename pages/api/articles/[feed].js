import { LIST_ARTICLES } from 'pages/articles';
import { ApolloClient } from 'apollo-boost';
import { config } from 'lib/apollo';
import { Feed } from 'feed';
const AVAILABLE_FEEDS = ['rss2', 'atom1', 'json1'];

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

  const feedInstance = new Feed({
    title: 'test feed',
  });

  data.ListArticles.edges.forEach(({ node }) => {
    feedInstance.addItem({
      content: node.text,
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
