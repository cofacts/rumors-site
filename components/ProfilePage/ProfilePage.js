import gql from 'graphql-tag';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import Head from 'next/head';
import Container from '@material-ui/core/Container';

import useCurrentUser from 'lib/useCurrentUser';

import AppLayout from 'components/AppLayout';
import UserPageHeader from './UserPageHeader';

const LOAD_USER = gql`
  query LoadProfilePage($id: String, $slug: String) {
    GetUser(id: $id, slug: $slug) {
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

function ProfilePage({ id, slug }) {
  const currentUser = useCurrentUser();

  const { data, loading } = useQuery(LOAD_USER, {
    variables: { id, slug },
  });

  const isSelf = currentUser && data?.GetUser?.id === currentUser.id;

  if (loading) {
    return (
      <AppLayout container={false}>
        <Head>
          <title>{t`Loading`}</title>
        </Head>
        <Container maxWidth="md">Loading...</Container>
      </AppLayout>
    );
  }

  if (!data || !data.GetUser) {
    return (
      <AppLayout container={false}>
        <Head>
          <title>{t`User not found`}</title>
        </Head>
        <Container maxWidth="md">{t`The user does not exist`}</Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout container={false}>
      <Head>
        <title>{data.GetUser.name}</title>
      </Head>
      <Container maxWidth="md">
        <UserPageHeader user={data.GetUser} isSelf={isSelf} />

        <div style={{ minHeight: '100vh' /* temp stub */ }}>
          {/* <pre>{JSON.stringify(data, null, '  ')}</pre> */}
          {/* {isSelf ? 'self' : 'not self'} */}
        </div>
      </Container>
    </AppLayout>
  );
}

export default ProfilePage;