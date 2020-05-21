import gql from 'graphql-tag';
import { useEffect, useRef, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider } from '@material-ui/core';
import { ngettext, msgid, t } from 'ttag';

import { useRouter } from 'next/router';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Head from 'next/head';

import withData from 'lib/apollo';
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
import ArticleItem from 'components/ArticleItem';
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
      alignItems: 'baseline',
    },
  },
  card: {
    background: theme.palette.common.white,
    borderRadius: 8,
  },
  main: {
    flex: 1,
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      flex: 3,
      marginRight: 12,
    },
  },
  aside: {
    background: 'transparent',
    [theme.breakpoints.up('md')]: {
      padding: '16px 28px',
      background: theme.palette.common.white,
    },
    '& h4': {
      [theme.breakpoints.up('md')]: {
        paddingBottom: 10,
        borderBottom: `1px solid ${theme.palette.secondary[500]}`,
      },
    },
  },
  newReplyContainer: {
    position: 'fixed',
    zIndex: 20,
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      padding: '28px 16px',
      marginTop: 24,
      borderRadius: 8,
    },
  },
  similarMessageContainer: {
    backgroundColor: theme.palette.common.white,
    minWidth: '100%',
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderRadius: 8,
    [theme.breakpoints.up('md')]: {
      margin: 0,
      width: 'auto',
    },
  },
  text: {
    [theme.breakpoints.down('md')]: {
      display: 'box',
      overflow: 'hidden',
      boxOrient: 'vertical',
      textOverflow: 'ellipsis',
      lineClamp: 5,
    },
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
            ...ArticleItem
          }
        }
      }
      articleCategories {
        ...ArticleCategoryData
      }
    }
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ReplyRequestReason.fragments.ReplyRequestInfo}
  ${CurrentReplies.fragments.CurrentRepliesData}
  ${NewReplySection.fragments.RelatedArticleData}
  ${ArticleItem.fragments.ArticleItem}
  ${ArticleCategories.fragments.ArticleCategoryData}
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
      }
    }
  }
  ${ReplyRequestReason.fragments.ReplyRequestInfoForUser}
  ${CurrentReplies.fragments.ArticleReplyForUser}
  ${ArticleCategories.fragments.ArticleCategoryDataForUser}
`;

function ArticlePage() {
  const { query } = useRouter();
  const [showForm, setShowForm] = useState(false);
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
  const classes = useStyles();

  useEffect(() => {
    if (!articleForUserCalled) {
      loadArticleForUser();
    } else {
      refetchArticleForUser();
    }
  }, [currentUser]);

  const handleNewReplySubmit = useCallback(() => {
    if (!replySectionRef.current) return;
    replySectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
            px={{ xs: 1.5, md: 3.5 }}
            py={1.5}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <h4>
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
            <Divider classes={{ root: classes.divider }} />
            <Box py={4} overflow="hidden">
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
              articleCategories={article.articleCategories}
            />
            <Trendline />
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
                }}
              />
            </footer>
          </Box>

          {showForm && (
            <div className={classes.newReplyContainer}>
              <NewReplySection
                article={article}
                existingReplyIds={(article?.articleReplies || []).map(
                  ({ replyId }) => replyId
                )}
                relatedArticles={article?.relatedArticles}
                onSubmissionComplete={handleNewReplySubmit}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}

          <Box
            className={classes.card}
            position="relative"
            px={{ xs: 1.5, md: 3.5 }}
            py={1.5}
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
              overflow="scroll"
            >
              {similarArticles.map(({ node }) => (
                <div key={node.id} className={classes.similarMessageContainer}>
                  <article className={classes.text}>{node.text}</article>
                  <Box py={1}>
                    <ArticleInfo article={node} />
                  </Box>
                  <Divider />
                </div>
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
    </AppLayout>
  );
}

export default withData(ArticlePage);
