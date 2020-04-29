import gql from 'graphql-tag';
import { useEffect, useRef, useCallback } from 'react';
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
    alignItems: 'baseline',
  },
  card: {
    background: theme.palette.common.white,
    borderRadius: 8,
  },
  main: {
    flex: 3,
    marginRight: 12,
  },
  aside: {
    flex: 1,
  },
  divider: {
    backgroundColor: theme.palette.secondary[500],
  },
}));

const LOAD_ARTICLE = gql`
  query LoadArticlePage($id: String!) {
    GetArticle(id: $id) {
      id
      text
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

  const article = data?.GetArticle || {};

  const { replyRequestCount, text, hyperlinks } = article;
  const classes = useStyles();
  const similarArticles = article?.similarArticles?.edges || [];

  const createdAt = article.createdAt
    ? new Date(article.createdAt)
    : new Date();

  const timeAgoStr = formatDistanceToNow(createdAt);

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

  return (
    <AppLayout>
      <Head>
        <title>
          {ellipsis(article.text, { wordCount: 100 })} | {t`Cofacts`}
        </title>
      </Head>
      <div className={classes.root}>
        <Box className={classes.main}>
          <Box className={classes.card} px={3.5} py={1.5}>
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
            <Box py={4}>
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
              <CreateReplyRequestForm articleId={article.id} />
            </footer>
          </Box>
          <Box className={classes.card} px={3.5} py={1.5} mt={3}>
            <h2>{t`Add a new reply`}</h2>
            <NewReplySection
              articleId={article.id}
              existingReplyIds={(article?.articleReplies || []).map(
                ({ replyId }) => replyId
              )}
              relatedArticles={article?.relatedArticles}
              onSubmissionComplete={handleNewReplySubmit}
            />
          </Box>
          <Box
            className={classes.card}
            px={3.5}
            py={1.5}
            mt={3}
            id="current-replies"
            ref={replySectionRef}
          >
            <h2>{t`Replies to the message`}</h2>
            <CurrentReplies articleReplies={article.articleReplies} />
          </Box>
        </Box>

        <Box className={cx(classes.card, classes.aside)} px={3.5} py={1.5}>
          <Box display="flex">
            <h4>{t`Similar messages`}</h4>
          </Box>
          <Divider classes={{ root: classes.divider }} />
          {similarArticles.length ? (
            similarArticles.map(({ node }) => (
              <Box key={node.id} pt={4}>
                {node.text}
                <Box py={1}>
                  <ArticleInfo article={node} />
                </Box>
                <Divider />
              </Box>
            ))
          ) : (
            <Box
              textAlign="center"
              pt={4}
              pb={3}
            >{t`No similar messages found`}</Box>
          )}
        </Box>
      </div>
    </AppLayout>
  );
}

export default withData(ArticlePage);
