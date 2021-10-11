import { withData } from 'next-apollo';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { t } from 'ttag';
import { headers } from './fetchAPI';
import { AUTH_ERROR_MSG } from 'constants/errors';

/**
 * Maps GraphQL object
 * @param {object} object
 */
export function dataIdFromObject(object) {
  switch (object.__typename) {
    case 'ArticleReply':
      return `${object.__typename}:${object.articleId}__${object.replyId}`;
    case 'ArticleCategory':
      return `${object.__typename}:${object.articleId}__${object.categoryId}`;
    default:
      // fall back to default handling
      return defaultDataIdFromObject(object);
  }
}

/* https://github.com/adamsoffer/next-apollo/pull/65#issuecomment-559788645 */
export const config = {
  link: ApolloLink.from([
    onError(errors => {
      console.error('[apollo-link-error]', errors);
      if (
        typeof alert !== 'undefined' &&
        errors.graphQLErrors &&
        errors.graphQLErrors.length === 1 &&
        errors.graphQLErrors[0].message === AUTH_ERROR_MSG
      ) {
        alert(t`Please login first.`);
      }
    }),
    new BatchHttpLink({
      uri:
        typeof window !== 'undefined'
          ? '/api/graphql'
          : `${process.env.API_URL}/graphql`, // Server URL (must be absolute on SSR)
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      headers,
    }),
  ]),
  createCache() {
    return new InMemoryCache({ dataIdFromObject });
  },
};

export default withData(config);
