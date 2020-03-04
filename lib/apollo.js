import { withData } from 'next-apollo';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import getConfig from 'next/config';
import { t } from 'ttag';
import { headers } from './fetchAPI';
import { AUTH_ERROR_MSG } from 'constants/errors';

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
  link: ApolloLink.from([
    onError(({ graphQLErrors }) => {
      if (
        graphQLErrors &&
        graphQLErrors.length === 1 &&
        graphQLErrors[0].message === AUTH_ERROR_MSG
      ) {
        alert(t`Please login first.`);
      }
    }),
    new BatchHttpLink({
      uri: `${PUBLIC_API_URL}/graphql`, // Server URL (must be absolute)
      headers,
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
    }),
  ]),
  createCache() {
    return new InMemoryCache({ dataIdFromObject: customIdMapper });
  },
};

export default withData(config);
