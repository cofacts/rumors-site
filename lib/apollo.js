import { withData } from 'next-apollo';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import getConfig from 'next/config';
import { headers } from './fetchAPI';

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

/**
 * Maps GraphQL object
 * @param {object} object
 */
function customIdMapper(object) {
  switch (object.__typename) {
    case 'ArticleReply':
      return `${object.__typename}:${object.articleId}__${object.replyId}`;
    default:
      // fall back to default handling
      return defaultDataIdFromObject(object);
  }
}

export const config = {
  link: new BatchHttpLink({
    uri: `${PUBLIC_API_URL}/graphql`, // Server URL (must be absolute)
    headers,
    credentials: 'include', // Additional fetch() options like `credentials` or `headers`
  }),
  createCache() {
    return new InMemoryCache({ dataIdFromObject: customIdMapper });
  },
};

export default withData(config);
