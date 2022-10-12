import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { t, ngettext, msgid } from 'ttag';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tools,
  Filters,
  CategoryFilter,
  ArticleTypeFilter,
  ReplyTypeFilter,
  TimeRange,
  SortInput,
  LoadMore,
} from 'components/ListPageControls';
import { CardHeader, CardContent } from 'components/Card';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
import ExpandableText from 'components/ExpandableText';
import ArticleReplyFeedbackControl from 'components/ArticleReplyFeedbackControl';
import ArticleReplySummary from 'components/ArticleReplySummary';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import ReplyInfo from 'components/ReplyInfo';
import Thumbnail from 'components/Thumbnail';

import { nl2br, linkify } from 'lib/text';

const REPLIES_ORDER = [
  {
    value: 'lastMatchingArticleReplyCreatedAt',
    label: t`Most recently replied`,
  },
  { value: 'lastRepliedAt', label: t`Most recently replied by any user` },
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
          ...ThumbnailArticleData
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
  ${Thumbnail.fragments.ThumbnailArticleData}
`;

const LOAD_REPLIED_ARTICLES_STAT = gql`
  query LoadRepliedArticlesStat(
    $filter: ListArticleFilter!
    $orderBy: [ListArticleOrderBy]
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy) {
      totalCount
      ...LoadMoreConnectionForStats
    }
  }
  ${LoadMore.fragments.LoadMoreConnectionForStats}
`;

const useStyles = makeStyles(theme => ({
  tools: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'var(--card-px)',
      marginRight: 'var(--card-px)',
    },
  },
  filters: {
    margin: '0 var(--card-px)',
    background: theme.palette.secondary[50],
  },
  articleReply: {
    '& + &': { marginTop: 24 },
  },
  bustHoaxDivider: {
    border: 0,
    margin: '16px 0',
    borderBottom: `1px dashed ${theme.palette.secondary[100]}`,
  },
  infos: {
    marginBottom: 4,
    [theme.breakpoints.up('md')]: {
      marginBottom: 12,
    },
  },
  reply: { marginLeft: 56 },
  replyControl: { marginTop: 16 },
}));

function ArticleReply({ articleReply }) {
  const classes = useStyles();

  const { user, reply, createdAt } = articleReply;

  return (
    <article className={classes.articleReply}>
      <Box
        component="header"
        display="flex"
        alignItems="center"
        mb={1}
        style={{ gap: '16px' }}
      >
        {user && (
          <Avatar
            size={40}
            user={user}
            className={classes.avatar} /*hasLink*/
          />
        )}
        <Box flexGrow={1}>
          <ArticleReplySummary articleReply={articleReply} />
          <ReplyInfo reply={reply} articleReplyCreatedAt={createdAt} />
        </Box>
      </Box>
      <section className={classes.reply}>
        <ExpandableText lineClamp={4}>
          {nl2br(linkify(reply.text))}
        </ExpandableText>
        <ArticleReplyFeedbackControl
          className={classes.replyControl}
          articleReply={articleReply}
        />
      </section>
    </article>
  );
}

/**
 * @param {object} urlQuery - URL query object and urserId
 * @param {string} userId - The author ID of article reply to look for
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(query = {}, userId) {
  const filterObj = {
    articleReply: { userId },
  };

  const selectedCategoryIds = CategoryFilter.getValues(query);
  if (selectedCategoryIds.length) filterObj.categoryIds = selectedCategoryIds;

  const [start, end] = TimeRange.getValues(query);

  if (start) {
    filterObj.articleReply.createdAt = {
      ...filterObj.articleReply.createdAt,
      GTE: start,
    };
  }
  if (end) {
    filterObj.articleReply.createdAt = {
      ...filterObj.articleReply.createdAt,
      LTE: end,
    };
  }

  const articleTypes = ArticleTypeFilter.getValues(query);
  if (articleTypes.length) filterObj.articleTypes = articleTypes;

  const selectedReplyTypes = ReplyTypeFilter.getValues(query);
  if (selectedReplyTypes.length)
    filterObj.articleReply.replyTypes = selectedReplyTypes;

  return filterObj;
}

function RepliedArticleTab({ userId }) {
  const classes = useStyles();
  const { query } = useRouter();

  const listQueryVars = {
    filter: urlQuery2Filter(query, userId),
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
  const totalCount = statsData?.totalCount;

  if (!userId) {
    return null;
  }

  return (
    <>
      <Tools className={classes.tools}>
        <TimeRange />
        <SortInput defaultOrderBy={DEFAULT_ORDER} options={REPLIES_ORDER} />
      </Tools>
      <Filters className={classes.filters}>
        <ArticleTypeFilter />
        <ReplyTypeFilter />
        <CategoryFilter />
      </Filters>
      {loading && !totalCount ? (
        <CardContent>{t`Loading...`}</CardContent>
      ) : listArticlesError ? (
        <CardContent>{listArticlesError.toString()}</CardContent>
      ) : totalCount === 0 ? (
        <CardContent>{t`No replied messages.`}</CardContent>
      ) : (
        <>
          <CardHeader>
            {ngettext(
              msgid`${totalCount} message matching criteria`,
              `${totalCount} messages matching criteria`,
              totalCount
            )}
          </CardHeader>
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
                  {timeAgo => t`First reported ${timeAgo}`}
                </TimeInfo>
              </Infos>
              <Thumbnail article={article} />
              {article.text && (
                <ExpandableText lineClamp={3}>{article.text}</ExpandableText>
              )}

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
