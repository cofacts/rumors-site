import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const CurrentUser = gql`
  fragment CurrentUser on User {
    id
    name
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
function useCurrentUser() {
  const [loadUser, { data }] = useLazyQuery(USER_QUERY);
  useEffect(() => loadUser(), []);

  return data?.GetUser;
}

export default useCurrentUser;
