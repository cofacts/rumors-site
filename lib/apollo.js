import {
  InMemoryCache,
  defaultDataIdFromObject,
  ApolloLink,
  ApolloClient,
} from '@apollo/client';
import { withApollo } from 'next-apollo';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
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

/**
 * ApolloClient factory function
 * @param {object} options - additional options when creating ApolloClient instance
 * @returns {ApolloClient} a brand new instance of ApolloClient
 */
export function createApolloClient(options = {}) {
  return new ApolloClient({
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
        uri: `${PUBLIC_API_URL}/graphql`, // Server URL (must be absolute)
        headers,
        credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      }),
    ]),
    cache: new InMemoryCache({ dataIdFromObject }),
    ...options,
  });
}

export default withApollo(
  createApolloClient({
    name: 'rumors-site',
  })
);
