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
import CommentTab from './CommentTab';
import ContributionChart from 'components/ContributionChart';
import { startOfWeek, subDays, format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  tabs: {
    margin: '0 var(--card-px)',
    paddingTop: theme.spacing(1),
    position: 'relative', // for ::after
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
}));

const LOAD_USER = gql`
  query LoadProfilePage($id: String, $slug: String) {
    GetUser(id: $id, slug: $slug) {
      id
      ...UserHeaderData
      contributions {
        date
        count
      }
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
    commentedReplies: ListArticleReplyFeedbacks(filter: { userId: $id }) {
      totalCount
    }
    comments: ListReplyRequests(filter: { userId: $id }) {
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
    ssr: false, // Speed up SSR
  });

  const isSelf = currentUser && data?.GetUser?.id === currentUser.id;

  // Automatic redirect to (new) slug
  //
  const router = useRouter();
  const latestSlug = data?.GetUser?.slug; // slug may update after user edits
  const userId = currentUser?.id;
  useEffect(() => {
    if (latestSlug === undefined) return;
    const targetPath = latestSlug
      ? `/user/${encodeURI(latestSlug)}`
      : `/user?id=${userId}`;
    if (router.asPath !== targetPath) {
      router.replace(targetPath);
    }
  }, [latestSlug, userId, router]);

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
      contentElem = <RepliedArticleTab userId={data?.GetUser?.id} />;
      break;
    case 'comments':
      contentElem = <CommentTab userId={data?.GetUser?.id} />;
      break;
  }
  const today = format(new Date(), 'yyyy-MM-dd');
  const aYearAgo = format(
    startOfWeek(subDays(new Date(), 365), { weekStartsOn: 6 }),
    'yyyy-MM-dd'
  );

  return (
    <AppLayout container={false}>
      <Head>
        <title>{data.GetUser.name}</title>
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <UserPageHeader
          user={data.GetUser}
          isSelf={isSelf}
          stats={{
            repliedArticles: contributionData?.repliedArticles?.totalCount,
            commentedReplies: contributionData?.commentedReplies?.totalCount,
            comments: contributionData?.comments?.totalCount,
          }}
        />
        <ContributionChart
          startDate={aYearAgo}
          endDate={today}
          data={data.GetUser.contributions}
        />

        <Card>
          <Tabs
            classes={{ root: classes.tabs }}
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tab) => {
              router.push({ query: { tab, id, slug } });
            }}
          >
            <Tab value="replies" label={t`Replied messages`} />
            <Tab value="comments" label={t`Comments`} />
          </Tabs>
          {contentElem}
        </Card>
      </Container>
    </AppLayout>
  );
}

export default ProfilePage;
