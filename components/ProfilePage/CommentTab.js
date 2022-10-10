import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { t, ngettext, msgid } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tools,
  TimeRange,
  SortInput,
  LoadMore,
} from 'components/ListPageControls';
import { CardHeader, CardContent } from 'components/Card';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
import ExpandableText from 'components/ExpandableText';
import ReplyRequestReason from 'components/ReplyRequestReason';
import Thumbnail from 'components/Thumbnail';

const COMMENTS_ORDER = [
  {
    value: 'createdAt',
    label: t`Commented at`,
  },
];
const DEFAULT_ORDER = COMMENTS_ORDER[0].value;

const LOAD_USER_COMMENTS = gql`
  query LoadUserComments(
    $filter: ListReplyRequestFilter!
    $orderBy: [ListReplyRequestOrderBy]
    $after: String
  ) {
    ListReplyRequests(
      filter: $filter
      orderBy: $orderBy
      after: $after
      first: 15
    ) {
      edges {
        node {
          id
          ...ReplyRequestInfo
          article {
            id
            replyRequestCount
            createdAt
            text
            ...ThumbnailArticleData
          }
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ReplyRequestReason.fragments.ReplyRequestInfo}
  ${LoadMore.fragments.LoadMoreEdge}
  ${Thumbnail.fragments.ThumbnailArticleData}
`;

const LOAD_USER_COMMENTS_STAT = gql`
  query LoadUserCommentsStat(
    $filter: ListReplyRequestFilter!
    $orderBy: [ListReplyRequestOrderBy]
  ) {
    ListReplyRequests(filter: $filter, orderBy: $orderBy) {
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
  divider: {
    border: 0,
    margin: '16px 0 0',
    borderBottom: `1px dashed ${theme.palette.secondary[100]}`,
  },
  infos: {
    marginBottom: 4,
    [theme.breakpoints.up('md')]: {
      marginBottom: 12,
    },
  },
}));

/**
 * @param {object} urlQuery - URL query object and urserId
 * @param {string} userId - The author ID of article reply to look for
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(query = {}, userId) {
  const filterObj = { userId };

  const [start, end] = TimeRange.getValues(query);

  if (start) {
    filterObj.createdAt = {
      ...filterObj.createdAt,
      GTE: start,
    };
  }
  if (end) {
    filterObj.createdAt = {
      ...filterObj.createdAt,
      LTE: end,
    };
  }

  return filterObj;
}

function CommentTab({ userId }) {
  const classes = useStyles();
  const { query } = useRouter();

  const listQueryVars = {
    filter: urlQuery2Filter(query, userId),
    orderBy: [{ [SortInput.getValue(query) || DEFAULT_ORDER]: 'DESC' }],
  };

  const {
    loading,
    fetchMore,
    data: listCommentsData,
    error: listCommentsError,
  } = useQuery(LOAD_USER_COMMENTS, {
    skip: !userId,
    variables: listQueryVars,
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LOAD_USER_COMMENTS_STAT, {
    skip: !userId,
    variables: listQueryVars,
  });

  // List data
  const commentEdges = listCommentsData?.ListReplyRequests?.edges || [];
  const statsData = listStatData?.ListReplyRequests || {};
  const totalCount = statsData?.totalCount;

  if (!userId) {
    return null;
  }

  return (
    <>
      <Tools className={classes.tools}>
        <TimeRange />
        <SortInput defaultOrderBy={DEFAULT_ORDER} options={COMMENTS_ORDER} />
      </Tools>
      {loading && !totalCount ? (
        <CardContent>{t`Loading...`}</CardContent>
      ) : listCommentsError ? (
        <CardContent>{listCommentsError.toString()}</CardContent>
      ) : totalCount === 0 ? (
        <CardContent>{t`This user does not provide comments to any message in the specified date range.`}</CardContent>
      ) : (
        <>
          <CardHeader>
            {ngettext(
              msgid`${totalCount} comment matching criteria`,
              `${totalCount} comments matching criteria`,
              totalCount
            )}
          </CardHeader>
          {commentEdges.map(({ node: { article, ...comment } }) => (
            <CardContent key={comment.id} style={{ paddingBottom: 0 }}>
              <Infos className={classes.infos}>
                <>
                  {ngettext(
                    msgid`${article.replyRequestCount} occurrence`,
                    `${article.replyRequestCount} occurrences`,
                    article.replyRequestCount
                  )}
                </>
                <TimeInfo time={article.createdAt}>
                  {timeAgo => (
                    <Link href="/article/[id]" as={`/article/${article.id}`}>
                      {t`First reported ${timeAgo}`}
                    </Link>
                  )}
                </TimeInfo>
              </Infos>
              <Thumbnail article={article} />
              {article.text && (
                <ExpandableText lineClamp={3}>{article.text}</ExpandableText>
              )}

              <hr className={classes.divider} />

              <ReplyRequestReason
                articleId={article.id}
                replyRequest={comment}
              />
            </CardContent>
          ))}

          <LoadMore
            edges={commentEdges}
            pageInfo={statsData?.pageInfo}
            loading={loading}
            onMoreRequest={args =>
              fetchMore({
                variables: args,
                updateQuery(prev, { fetchMoreResult }) {
                  if (!fetchMoreResult) return prev;
                  const newCommentData = fetchMoreResult?.ListReplyRequests;
                  return {
                    ...prev,
                    ListArticles: {
                      ...newCommentData,
                      edges: [...commentEdges, ...newCommentData.edges],
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

export default CommentTab;
