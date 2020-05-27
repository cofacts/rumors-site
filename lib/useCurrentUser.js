import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { pushToDataLayer } from './gtm';

export const CurrentUser = gql`
  fragment CurrentUser on User {
    id
    name
    avatarUrl
  }
`;

const USER_QUERY = gql`
  query CurrentUserQuery {
    GetUser {
      ...CurrentUser
    }
  }
  ${CurrentUser}
`;

/**
 * Loads currentUser on browser load. Should load from cache first.
 */
let pushDataLayerHandle;
function useCurrentUser() {
  const [loadUser, { data }] = useLazyQuery(USER_QUERY, {
    onCompleted(data) {
      // If multiple component with useCurrentUser() is mounted in the same time,
      // onCompleted will be invoked multiple times.
      //
      // We use setTimeout to get rid of duplicated onCompleted calls.
      clearTimeout(pushDataLayerHandle);
      pushDataLayerHandle = setTimeout(() => {
        pushToDataLayer({ CURRENT_USER: data?.GetUser });
      }, 10);
    },
  });
  useEffect(() => loadUser(), []);

  return data?.GetUser;
}

export default useCurrentUser;
