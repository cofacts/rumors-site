import gql from 'graphql-tag';
import { c, t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { ListPageCards, ArticleCard } from 'components/ListPageDisplays';
import { LoadMore } from 'components/ListPageControls';

import leftImage from './images/article-left.png';
import rightImage from './images/article-right.png';

const LIST_ARTICLES = gql`
  query GetArticlesInLandingPage {
    ListArticles(
      filter: { replyRequestCount: { GTE: 3 } }
      orderBy: [{ createdAt: DESC }]
      first: 10
    ) {
      edges {
        node {
          id
          ...ArticleCard
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ArticleCard.fragments.ArticleCard}
  ${LoadMore.fragments.LoadMoreEdge}
`;

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary[200],
    padding: '60px 30px',
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      padding: 0,
      background: theme.palette.background.default,
    },

    '& > h3': {
      width: '80%',
      maxWidth: 1200,
      fontSize: 48,
      fontWeight: 'bold',
      lineHeight: 1.45,
      margin: '0 auto 26px',

      [theme.breakpoints.only('md')]: {
        width: '100%',
        paddingLeft: 40,
      },

      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        fontWeight: 'normal',
        textAlign: 'center',
        width: 'unset',
        margin: '16px auto 4px',
      },
    },
  },
  articleContainer: {
    position: 'relative',
    width: '80%',
    maxWidth: 1200,
    height: 600,
    background: theme.palette.background.default,
    borderRadius: 8,
    padding: '0 15px',
    margin: '0 auto',

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      orderRadius: 0,
      padding: 12,
    },
  },
  scrollbarWrapper: {
    width: '100%',
    height: '100%',
    padding: '15px 0',
    overflow: 'auto',
    msOverflowStyle: 'none' /* hide scrollbar on IE and Edge */,
    scrollbarWidth: 'none' /* hide scrollbar on Firefox */,

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  leftImage: {
    position: 'absolute',
    left: -180,
    bottom: -100,

    [theme.breakpoints.down('md')]: {
      width: 295,
      left: -55,
      bottom: -75,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  rightImage: {
    position: 'absolute',
    right: -160,
    top: -120,

    [theme.breakpoints.down('md')]: {
      width: 255,
      right: -30,
      top: -140,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const SectionArticles = () => {
  const classes = useStyles();
  const router = useRouter();

  const {
    loading,
    data: listArticlesData,
    error: listArticlesError,
  } = useQuery(LIST_ARTICLES, {
    ssr: false, // Fetch on browser is OK
  });

  // List data
  const articleEdges = listArticlesData?.ListArticles?.edges || [];

  return (
    <section className={classes.root}>
      <h3>{c('landing page').t`Everyone wants to know...`}</h3>
      <div className={classes.articleContainer}>
        <img className={classes.leftImage} src={leftImage} />
        <img className={classes.rightImage} src={rightImage} />
        <div className={classes.scrollbarWrapper}>
          {loading && !articleEdges.length ? (
            t`Loading...`
          ) : listArticlesError ? (
            listArticlesError.toString()
          ) : (
            <>
              <ListPageCards>
                {articleEdges.map(({ node: article }) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </ListPageCards>
              <LoadMore
                edges={articleEdges}
                loading={loading}
                onMoreRequest={() => {
                  router.push({
                    pathname: '/hoax-for-you',
                  });
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionArticles;
