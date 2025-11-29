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
    position: 'relative',
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
      slug
      name
      createdAt
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
  const router = useRouter();
  const classes = useStyles();
  const currentUser = useCurrentUser();

  // ---- 1. 先抓 user 資料 ----
  const { data, loading } = useQuery(LOAD_USER, {
    variables: { id, slug },
  });

  const user = data?.GetUser;
  const userId = user?.id;
  const latestSlug = user?.slug;

  const { data: contributionData } = useQuery(LOAD_CONTRIBUTION, {
    variables: { id: userId },
    skip: !userId,
    ssr: false,
  });

  // ---- 2. 安全 redirect（避免 loop + 等後端更新） ----
  useEffect(() => {
    if (loading) return;           // 資料未到 → 不 redirect
    if (!userId) return;           // userId 尚未取到 → 不 redirect
    if (latestSlug === undefined) return; // slug 尚未準備好 → 不 redirect

    const target = latestSlug
      ? `/user/${encodeURI(latestSlug)}`
      : `/user?id=${userId}`;

    const currentBase = router.asPath.split('?')[0];
    if (currentBase === target) return;

    // ★ 延遲 1 秒再 redirect，避免後端 slug 還沒寫完
    const timer = setTimeout(() => {
      router.replace(target);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading, userId, latestSlug]);

  // ---- 3. Loading 狀態 ----
  if (loading || !userId) {
    return (
      <AppLayout container={false}>
        <Head><title>{t`Loading`}</title></Head>
        <Container maxWidth="md" className={classes.container}>
          Loading...
        </Container>
      </AppLayout>
    );
  }

  // ---- 4. User not found ----
  if (!user) {
    return (
      <AppLayout container={false}>
        <Head><title>{t`User not found`}</title></Head>
        <Container maxWidth="md" className={classes.container}>
          {t`The user does not exist`}
        </Container>
      </AppLayout>
    );
  }

  const {
    query: { tab = 'replies' },
  } = router;

  const today = format(new Date(), 'yyyy-MM-dd');
  const aYearAgo = format(
    startOfWeek(subDays(new Date(), 365), { weekStartsOn: 6 }),
    'yyyy-MM-dd'
  );

  let contentElem = null;
  switch (tab) {
    case 'replies':
      contentElem = <RepliedArticleTab userId={userId} />;
      break;
    case 'comments':
      contentElem = <CommentTab userId={userId} />;
      break;
  }

  return (
    <AppLayout container={false}>
      <Head><title>{user.name}</title></Head>

      <Container maxWidth="md" className={classes.container}>
        <UserPageHeader
          user={user}
          isSelf={currentUser && user.id === currentUser.id}
          stats={{
            repliedArticles: contributionData?.repliedArticles?.totalCount,
            commentedReplies: contributionData?.commentedReplies?.totalCount,
            comments: contributionData?.comments?.totalCount,
          }}
        />

        <ContributionChart
          startDate={aYearAgo}
          endDate={today}
          data={user.contributions}
        />

        <Card>
          <Tabs
            classes={{ root: classes.tabs }}
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tab) => {
              router.push({ query: { tab, id: userId } });
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
