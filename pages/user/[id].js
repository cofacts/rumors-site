import gql from 'graphql-tag';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';

import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';

import AppLayout from 'components/AppLayout';
import UserPageHeader from 'components/UserPageHeader';

const LOAD_USER = gql`
  query LoadUserPage($id: String!) {
    GetUser(id: $id) {
      id
      ...UserHeaderData
    }
    ListReplies(filter: { userId: $id }, orderBy: [{ createdAt: DESC }]) {
      edges {
        node {
          id
          text
          articleReplies(status: NORMAL) {
            article {
              id
              text
            }
          }
        }
      }
    }
  }
  ${UserPageHeader.fragments.UserHeaderData}
`;

function ProfilePage() {
  const {
    query: { id },
  } = useRouter();
  const currentUser = useCurrentUser();
  const isSelf = currentUser && id === currentUser.id;

  const { data, loading } = useQuery(LOAD_USER, {
    variables: { id },
  });

  if (loading) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Loading`}</title>
        </Head>
        Loading...
      </AppLayout>
    );
  }

  if (!data || !data.user) {
    return (
      <AppLayout>
        <Head>
          <title>{t`User not found`}</title>
        </Head>
        {t`The user does not exist`}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <UserPageHeader user={data.user} isSelf={isSelf} />

      <pre>{JSON.stringify(data, null, '  ')}</pre>

      {isSelf ? 'self' : 'not self'}
    </AppLayout>
  );
}

export default withData(ProfilePage);
