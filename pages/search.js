import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { t } from 'ttag';
import querystring from 'querystring';
import ArticlePageLayout from 'components/ArticlePageLayout';
import ReplySearchPageLayout from 'components/ReplySearchPageLayout';
import AppLayout from 'components/AppLayout';
import withData from 'lib/apollo';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const useStyles = makeStyles(theme => ({
  jumbotron: {
    position: 'absolute',
    background: '#202020',
    width: '100vw',
    minWidth: '100vw',
    left: 0,
  },
  search: {
    color: theme.palette.common.white,
  },
  content: {
    paddingTop: 230,
  },
}));

const CustomTab = withStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    '&$selected': {
      color: theme.palette.primary,
    },
  },
}))(Tab);

function SearchPage() {
  const router = useRouter();
  const queryString = querystring.stringify(router.query);
  const { query } = router;

  const classes = useStyles();

  const navigate = type =>
    router.push({ pathname: '/search', query: { ...query, type } });

  return (
    <AppLayout>
      <Head>
        <title>{t`Search`}</title>
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${PUBLIC_URL}/api/articles/atom1?${queryString}`}
        />
      </Head>
      <div className={classes.jumbotron}>
        <Container>
          <Box py="56px">
            <h2 className={classes.search}>{t`Search`}</h2>
          </Box>
        </Container>
        <Container>
          <Tabs
            value={query.type}
            onChange={(e, page) => navigate(page)}
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs"
          >
            <CustomTab value="messages" label={t`Messages`} />
            <CustomTab value="replies" label={t`Replies`} />
          </Tabs>
        </Container>
      </div>
      <div className={classes.content}>
        {query.type === 'messages' && (
          <ArticlePageLayout displayHeader={false} />
        )}
        {query.type === 'replies' && <ReplySearchPageLayout />}
      </div>
    </AppLayout>
  );
}

export default withData(SearchPage);
