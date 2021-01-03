import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { t, ngettext, msgid } from 'ttag';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tools,
  Filters,
  CategoryFilter,
  ReplyTypeFilter,
  TimeRange,
  SortInput,
  LoadMore,
} from 'components/ListPageControls';
import { CardContent } from 'components/Card';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
import ExpandableText from 'components/ExpandableText';
import ArticleReplyFeedbackControl from 'components/ArticleReplyFeedbackControl';
import ArticleReplySummary from 'components/ArticleReplySummary';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ReplyInfo from 'components/ReplyInfo';

import { nl2br, linkify } from 'lib/text';

const REPLIES_ORDER = [
  { value: 'lastRepliedAt', label: t`Most recently replied` },
  { value: 'lastRequestedAt', label: t`Most recently asked` },
  { value: 'replyRequestCount', label: t`Most asked` },
];
const DEFAULT_ORDER = REPLIES_ORDER[0].value;

const LOAD_REPLIED_ARTICLES = gql`
  query LoadRepliedArticles(
    $filter: ListArticleFilter!
    $orderBy: [ListArticleOrderBy]
    $after: String
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy, after: $after, first: 15) {
      edges {
        node {
          id
          replyRequestCount
          createdAt
          text
          articleReplies(status: NORMAL) {
            replyId
            createdAt
            user {
              id
              ...AvatarData
            }
            reply {
              id
              text
              ...ReplyInfo
            }
            ...ArticleReplySummaryData
            ...ArticleReplyFeedbackControlData
          }
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ArticleReplyFeedbackControl.fragments.ArticleReplyFeedbackControlData}
  ${LoadMore.fragments.LoadMoreEdge}
  ${ReplyInfo.fragments.replyInfo}
  ${Avatar.fragments.AvatarData}
  ${ArticleReplySummary.fragments.ArticleReplySummaryData}
`;

const LOAD_REPLIED_ARTICLES_STAT = gql`
  query LoadRepliedArticlesStat(
    $filter: ListArticleFilter!
    $orderBy: [ListArticleOrderBy]
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy) {
      ...LoadMoreConnectionForStats
    }
  }
  ${LoadMore.fragments.LoadMoreConnectionForStats}
`;

const useStyles = makeStyles(theme => ({
  bustHoaxDivider: {
    border: 0,
    borderBottom: `1px dashed ${theme.palette.secondary[100]}`,
  },
  infos: {
    marginBottom: 4,
    [theme.breakpoints.up('md')]: {
      marginBottom: 12,
    },
  },
}));

function ArticleReply({ articleReply }) {
  const classes = useStyles();

  const { user, reply, createdAt } = articleReply;

  return (
    <>
      <Box component="header" display="flex" alignItems="center">
        {user && <Avatar user={user} className={classes.avatar} hasLink />}
        <Box flexGrow={1}>
          <ArticleReplySummary articleReply={articleReply} />
          <ReplyInfo reply={reply} articleReplyCreatedAt={createdAt} />
        </Box>
      </Box>
      <section className={classes.content}>
        <ExpandableText lineClamp={10}>
          {nl2br(linkify(reply.text))}
        </ExpandableText>
      </section>

      <ArticleReplyFeedbackControl articleReply={articleReply} />
    </>
  );
}

/**
 * @param {object} urlQuery - URL query object and urserId
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(query = {}) {
  const filterObj = {
    // Default filters
    replyCount: { GTE: 1 },
  };

  const selectedCategoryIds = CategoryFilter.getValues(query);
  if (selectedCategoryIds.length) filterObj.categoryIds = selectedCategoryIds;

  const [start, end] = TimeRange.getValues(query);

  if (start) {
    filterObj.repliedAt = { ...filterObj.repliedAt, GTE: start };
  }
  if (end) {
    filterObj.repliedAt = { ...filterObj.repliedAt, LTE: end };
  }

  const selectedReplyTypes = ReplyTypeFilter.getValues(query);
  if (selectedReplyTypes.length) filterObj.replyTypes = selectedReplyTypes;

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }

  return filterObj;
}

function RepliedArticleTab({ userId }) {
  const classes = useStyles();
  const { query } = useRouter();

  const listQueryVars = {
    filter: {
      ...urlQuery2Filter(query),
      articleRepliesFrom: { userId, exists: true },
    },
    orderBy: [{ [SortInput.getValue(query) || DEFAULT_ORDER]: 'DESC' }],
  };

  const {
    loading,
    fetchMore,
    data: listArticlesData,
    error: listArticlesError,
  } = useQuery(LOAD_REPLIED_ARTICLES, {
    skip: !userId,
    variables: listQueryVars,
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LOAD_REPLIED_ARTICLES_STAT, {
    skip: !userId,
    variables: listQueryVars,
  });

  // List data
  const articleEdges = listArticlesData?.ListArticles?.edges || [];
  const statsData = listStatData?.ListArticles || {};

  if (!userId) {
    return null;
  }

  return (
    <>
      <Tools>
        <TimeRange />
        <SortInput defaultOrderBy={DEFAULT_ORDER} options={REPLIES_ORDER} />
      </Tools>
      <Filters>
        <ReplyTypeFilter />
        <CategoryFilter />
      </Filters>
      {loading && !articleEdges.length ? (
        t`Loading...`
      ) : listArticlesError ? (
        listArticlesError.toString()
      ) : (
        <>
          {articleEdges.map(({ node: article }) => (
            <CardContent key={article.id}>
              <Infos className={classes.infos}>
                <>
                  {ngettext(
                    msgid`${article.replyRequestCount} occurrence`,
                    `${article.replyRequestCount} occurrences`,
                    article.replyRequestCount
                  )}
                </>
                <TimeInfo time={article.createdAt}>
                  {timeAgo => t`First reported ${timeAgo} ago`}
                </TimeInfo>
              </Infos>
              <ExpandableText lineClamp={2}>{article.text}</ExpandableText>

              <hr className={classes.bustHoaxDivider} />

              {article.articleReplies
                .filter(articleReply => userId === articleReply.user.id)
                .map(articleReply => (
                  <ArticleReply
                    key={articleReply.replyId}
                    articleReply={articleReply}
                  />
                ))}
            </CardContent>
          ))}

          <LoadMore
            edges={articleEdges}
            pageInfo={statsData?.pageInfo}
            loading={loading}
            onMoreRequest={args =>
              fetchMore({
                variables: args,
                updateQuery(prev, { fetchMoreResult }) {
                  if (!fetchMoreResult) return prev;
                  const newArticleData = fetchMoreResult?.ListArticles;
                  return {
                    ...prev,
                    ListArticles: {
                      ...newArticleData,
                      edges: [...articleEdges, ...newArticleData.edges],
                    },
                  };
                },
              })
            }
          />
        </>
      )}
    </>
  );
}

export default RepliedArticleTab;
