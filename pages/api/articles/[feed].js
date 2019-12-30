import { LIST_ARTICLES } from 'pages/articles';
import { ApolloClient } from 'apollo-boost';
import { config } from 'lib/apollo';
const AVAILABLE_FEEDS = ['rss2', 'atom1', 'json1'];

async function articleFeedHandler(req, res) {
  const {
    query: { feed },
  } = req;

  if (!AVAILABLE_FEEDS.includes(feed)) {
    res.status(400).send('Invalid feed type');
    return;
  }

  const { createCache, ...otherConfigs } = config;
  const client = new ApolloClient({ ...otherConfigs, cache: createCache() });

  const { data, errors } = await client.query({
    query: LIST_ARTICLES,
  });
  if (errors && errors.length) {
    res.status(400).json(errors);
  }

  res.status(200).json(data);
}

export default articleFeedHandler;
