import { makeStyles } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { t } from 'ttag';
import querystring from 'querystring';
import ArticlePageLayout from 'components/ArticlePageLayout';
import AppLayout from 'components/AppLayout';
import cx from 'clsx';

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
  tab: {
    cursor: 'pointer',
    color: theme.palette.secondary[200],
    padding: '14px 12px',
    outline: 'none',
    '&.active': {
      color: theme.palette.primary.main,
      borderBottom: `4px solid ${theme.palette.primary.main}`,
    },
  },
  content: {
    paddingTop: 230,
  },
}));

function SearchPage() {
  const router = useRouter();
  const queryString = querystring.stringify(router.query);
  const { query } = router;

  const classes = useStyles();

  const navigate = type => () =>
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
          <Box display="flex">
            <div
              className={cx(classes.tab, query.type === 'messages' && 'active')}
              tabIndex="0"
              onClick={navigate('messages')}
            >
              {t`Messages`}
            </div>
            <div
              className={cx(classes.tab, query.type === 'replies' && 'active')}
              tabIndex="1"
              onClick={navigate('replies')}
            >
              {t`Replies`}
            </div>
          </Box>
        </Container>
      </div>
      <div className={classes.content}>
        <ArticlePageLayout q={{ [query.type]: query.q }} />
      </div>
    </AppLayout>
  );
}

export default SearchPage;
