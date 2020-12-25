import { useEffect } from 'react';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'lib/useCurrentUser';

import AppLayout from 'components/AppLayout';
import { Card } from 'components/Card';
import UserPageHeader from './UserPageHeader';
import RepliedArticleTab from './RepliedArticleTab';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const LOAD_USER = gql`
  query LoadProfilePage($id: String, $slug: String) {
    GetUser(id: $id, slug: $slug) {
      id
      ...UserHeaderData
    }
  }
  ${UserPageHeader.fragments.UserHeaderData}
`;

const LOAD_CONTRIBUTION = gql`
  query LoadContribution($id: String!) {
    repliedArticles: ListArticles(
      filter: { articleRepliesFrom: { userId: $id, exists: true } }
    ) {
      totalCount
    }
  }
`;

function ProfilePage({ id, slug }) {
  const classes = useStyles();
  const currentUser = useCurrentUser();
  const { data, loading } = useQuery(LOAD_USER, {
    variables: { id, slug },
  });
  const { data: contributionData } = useQuery(LOAD_CONTRIBUTION, {
    variables: { id: data?.GetUser?.id },
    skip: !data?.GetUser?.id,
  });

  const isSelf = currentUser && data?.GetUser?.id === currentUser.id;

  // Automatic redirect to (new) slug
  //
  const router = useRouter();
  const latestSlug = data?.GetUser?.slug; // slug may update after user edits
  useEffect(() => {
    const targetPath = `/user/${latestSlug}`;
    if (latestSlug && window.location.pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [latestSlug, router]);

  if (loading) {
    return (
      <AppLayout container={false}>
        <Head>
          <title>{t`Loading`}</title>
        </Head>
        <Container maxWidth="md" className={classes.container}>
          Loading...
        </Container>
      </AppLayout>
    );
  }

  if (!data || !data.GetUser) {
    return (
      <AppLayout container={false}>
        <Head>
          <title>{t`User not found`}</title>
        </Head>
        <Container maxWidth="md" className={classes.container}>
          {t`The user does not exist`}
        </Container>
      </AppLayout>
    );
  }

  const {
    query: { tab = 'replies' },
  } = router;
  let contentElem = null;
  switch (tab) {
    case 'replies':
    default:
      contentElem = <RepliedArticleTab userId={data?.GetUser?.id} />;
  }

  return (
    <AppLayout container={false}>
      <Head>
        <title>{data.GetUser.name}</title>
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <UserPageHeader user={data.GetUser} isSelf={isSelf} />
        <Card>
          <Tabs
            value={tab}
            onChange={(e, tab) => {
              router.push({ query: { tab } });
            }}
          >
            <Tab
              value="replies"
              label={`${t`Replied messages`} ${
                contributionData?.repliedArticles?.totalCount
              }`}
            />
          </Tabs>
          {contentElem}
        </Card>
      </Container>
    </AppLayout>
  );
}

export default ProfilePage;
