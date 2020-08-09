import { useQuery, useLazyQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useEffect, useRef, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Snackbar } from '@material-ui/core';
import { ngettext, msgid, t } from 'ttag';

import { useRouter } from 'next/router';
import Head from 'next/head';

import withApollo from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';
import { nl2br, linkify, ellipsis } from 'lib/text';
import { usePushToDataLayer } from 'lib/gtm';

import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import isValid from 'date-fns/isValid';

import AppLayout from 'components/AppLayout';
import Hyperlinks from 'components/Hyperlinks';
import CurrentReplies from 'components/CurrentReplies';
import ReplyRequestReason from 'components/ReplyRequestReason';
import CreateReplyRequestForm from 'components/CreateReplyRequestForm';
import NewReplySection from 'components/NewReplySection';
import ArticleInfo from 'components/ArticleInfo';
import ArticleCategories from 'components/ArticleCategories';
import cx from 'clsx';
import Trendline from 'components/Trendline';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: '24px 0',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  title: {
    position: 'relative',
    left: -8,
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary.main,
    padding: '10px 32px',
    [theme.breakpoints.down('md')]: {
      padding: '10px 16px',
      fontSize: 12,
    },
    '&:after': {
      position: 'absolute',
      top: 0,
      right: 0,
      borderRight: `20px solid ${theme.palette.common.white}`,
      borderBottom: `20px solid ${theme.palette.primary[500]}`,
      borderTop: `20px solid ${theme.palette.primary[500]}`,
      height: 0,
      content: '""',
    },
    '&:before': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      height: 0,
      borderTop: `8px solid ${theme.palette.primary[700]}`,
      borderLeft: '8px solid transparent',
      background: 'transparent',
      content: '""',
    },
  },
  card: {
    background: theme.palette.common.white,
    borderRadius: 8,
  },
  main: {
    flex: 1,
    marginRight: 0,
    minWidth: 0,
    [theme.breakpoints.up('md')]: {
      flex: 3,
      marginRight: 12,
    },
  },
  aside: {
    flex: 1,
    background: 'transparent',
    minWidth: 0,
    [theme.breakpoints.up('md')]: {
      padding: '21px 19px',
      background: theme.palette.common.white,
    },
    '& h4': {
      [theme.breakpoints.up('md')]: {
        marginBottom: 0,
        paddingBottom: 16,
        borderBottom: `1px solid ${theme.palette.secondary[500]}`,
      },
    },
  },
  newReplyContainer: {
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      zIndex: 10,
      position: 'relative',
      padding: '28px 16px',
      marginTop: 24,
      borderRadius: 8,
    },
  },
  similarMessageContainer: {
    backgroundColor: theme.palette.common.white,
    minWidth: '100%',
    padding: '17px 19px',
    marginRight: theme.spacing(2),
    borderRadius: 8,
    textDecoration: 'none',
    color: 'inherit',
    [theme.breakpoints.up('md')]: {
      padding: '16px 0 0 0 ',
      margin: 0,
      width: 'auto',
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
      '&:last-child': {
        borderBottom: 'none',
      },
    },
  },
  text: {
    display: 'box',
    overflow: 'hidden',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 5,
  },
}));

const LOAD_ARTICLE = gql`
  query LoadArticlePage($id: String!) {
    GetArticle(id: $id) {
      id
      text
      requestedForReply
      replyRequestCount
      replyCount
      createdAt
      references {
        type
      }
      hyperlinks {
        ...HyperlinkData
      }
      replyRequests {
        ...ReplyRequestInfo
      }
      articleReplies {
        ...CurrentRepliesData
      }
      ...RelatedArticleData
      similarArticles: relatedArticles {
        edges {
          node {
            id
            text
            ...ArticleInfo
          }
        }
      }
      articleCategories {
        ...ArticleCategoryData
        ...AddCategoryDialogData
      }
    }
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ReplyRequestReason.fragments.ReplyRequestInfo}
  ${CurrentReplies.fragments.CurrentRepliesData}
  ${NewReplySection.fragments.RelatedArticleData}
  ${ArticleCategories.fragments.ArticleCategoryData}
  ${ArticleCategories.fragments.AddCategoryDialogData}
  ${ArticleInfo.fragments.articleInfo}
`;

const LOAD_ARTICLE_FOR_USER = gql`
  query LoadArticlePageForUser($id: String!) {
    GetArticle(id: $id) {
      id # Required, https://github.com/apollographql/apollo-client/issues/2510
      replyRequests {
        ...ReplyRequestInfoForUser
      }
      articleReplies {
        ...ArticleReplyForUser
      }
      articleCategories {
        ...ArticleCategoryDataForUser
        ...AddCategoryDialogData
      }
    }
  }
  ${ReplyRequestReason.fragments.ReplyRequestInfoForUser}
  ${CurrentReplies.fragments.ArticleReplyForUser}
  ${ArticleCategories.fragments.ArticleCategoryDataForUser}
  ${ArticleCategories.fragments.AddCategoryDialogData}
`;

function ArticlePage() {
  const { query } = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState(0);
  const articleVars = { id: query.id };

  const { data, loading } = useQuery(LOAD_ARTICLE, {
    variables: articleVars,
  });
  const [
    loadArticleForUser,
    { refetch: refetchArticleForUser, called: articleForUserCalled },
  ] = useLazyQuery(LOAD_ARTICLE_FOR_USER, {
    variables: articleVars,
    fetchPolicy: 'network-only',
  });
  const currentUser = useCurrentUser();

  const replySectionRef = useRef(null);
  const newReplyRef = useRef(null);

  const classes = useStyles();

  // Load user field when currentUser changes
  useEffect(() => {
    if (!articleForUserCalled) {
      loadArticleForUser();
    } else {
      refetchArticleForUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleNewReplySubmit = useCallback(() => {
    if (!replySectionRef.current) return;
    replySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setFlashMessage(t`Your reply has been submitted.`);
  }, []);

  const handleError = useCallback(error => {
    console.error(error);
    setFlashMessage(error.toString());
  }, []);

  const handleFormClose = () => setShowForm(false);

  const article = data?.GetArticle;

  usePushToDataLayer(!!article, { event: 'dataLoaded' });

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

  if (!article) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Not found`}</title>
        </Head>
        {t`Message does not exist`}
      </AppLayout>
    );
  }

  const { replyRequestCount, text, hyperlinks } = article;
  const similarArticles = article?.similarArticles?.edges || [];

  const createdAt = article.createdAt
    ? new Date(article.createdAt)
    : new Date();

  const timeAgoStr = formatDistanceToNow(createdAt);

  return (
    <AppLayout>
      <Head>
        <title>
          {ellipsis(article.text, { wordCount: 100 })} | {t`Cofacts`}
        </title>
      </Head>
      <div className={classes.root}>
        <div className={classes.main}>
          <Box
            className={classes.card}
            position="relative"
            pb={{ xs: '13px', md: '21px' }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              pr={{ xs: '12px', md: '19px' }}
            >
              <h4 className={classes.title}>
                {ngettext(
                  msgid`${replyRequestCount} person report this message`,
                  `${replyRequestCount} people report this message`,
                  replyRequestCount
                )}
              </h4>

              {isValid(createdAt) && (
                <span
                  title={format(createdAt)}
                >{t`First reported ${timeAgoStr} ago`}</span>
              )}
            </Box>
            <Box px={{ xs: '12px', md: '19px' }}>
              <Box py={3} overflow="hidden">
                {nl2br(
                  linkify(text, {
                    props: {
                      target: '_blank',
                    },
                  })
                )}
                <Hyperlinks hyperlinks={hyperlinks} />
              </Box>
              <ArticleCategories
                articleId={article.id}
                articleCategories={article.articleCategories.filter(
                  ({ status }) => status === 'NORMAL'
                )}
              />
              <Trendline id={article.id} />
              <Divider />
              <footer>
                {article.replyRequests.map((replyRequest, idx) => (
                  <ReplyRequestReason
                    key={replyRequest.id}
                    articleId={article.id}
                    replyRequest={replyRequest}
                    isArticleCreator={idx === 0}
                  />
                ))}
                <CreateReplyRequestForm
                  requestedForReply={article.requestedForReply}
                  articleId={article.id}
                  onNewReplyButtonClick={() => {
                    setShowForm(true);
                    // use setTimeout to make sure the form has shown
                    setTimeout(
                      () =>
                        newReplyRef.current.scrollIntoView({
                          behavior: 'smooth',
                        }),
                      0
                    );
                  }}
                />
              </footer>
            </Box>
          </Box>

          {showForm && (
            <div className={classes.newReplyContainer} ref={newReplyRef}>
              <NewReplySection
                article={article}
                existingReplyIds={(article?.articleReplies || []).map(
                  ({ replyId }) => replyId
                )}
                relatedArticles={article?.relatedArticles}
                onSubmissionComplete={handleNewReplySubmit}
                onError={handleError}
                onClose={handleFormClose}
              />
            </div>
          )}

          <Box
            className={classes.card}
            position="relative"
            px={{ xs: '12px', md: '19px' }}
            py={{ xs: '13px', md: '21px' }}
            mt={3}
            id="current-replies"
            ref={replySectionRef}
          >
            <h2>{t`${article.articleReplies.length} replies to the message`}</h2>
            <Divider classes={{ root: classes.divider }} />
            <CurrentReplies articleReplies={article.articleReplies} />
          </Box>
        </div>

        <div className={cx(classes.card, classes.aside)}>
          <h4>{t`Similar messages`}</h4>
          {similarArticles.length ? (
            <Box
              display="flex"
              flexDirection={{ xs: 'row', md: 'column' }}
              overflow="auto"
            >
              {similarArticles.map(({ node }) => (
                <Link key={node.id} href={`/article/${node.id}`}>
                  <a className={classes.similarMessageContainer}>
                    <article className={classes.text}>{node.text}</article>
                    <Box pt={1.5} pb={2}>
                      <ArticleInfo article={node} />
                    </Box>
                  </a>
                </Link>
              ))}
            </Box>
          ) : (
            <Box
              textAlign="center"
              pt={4}
              pb={3}
            >{t`No similar messages found`}</Box>
          )}
        </div>
      </div>
      <Snackbar
        open={!!flashMessage}
        onClose={() => setFlashMessage('')}
        message={flashMessage}
      />
    </AppLayout>
  );
}

export default withApollo({ ssr: true })(ArticlePage);
