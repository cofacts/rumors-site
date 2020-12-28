import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { t, ngettext, msgid } from 'ttag';
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
import ArticleReply from 'components/ArticleReply';
import { CardContent } from 'components/Card';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
import ExpandableText from 'components/ExpandableText';

const REPLIES_ORDER = [
  { value: 'lastRepliedAt', label: t`Most recently replied` },
  { value: 'lastRequestedAt', label: t`Most recently asked` },
  { value: 'replyRequestCount', label: t`Most asked` },
];
const DEFAULT_ORDER = REPLIES_ORDER[0].value;

const LOAD_REPLIED_ARTICLES = gql`
  query LoadRepliedArticles($userId: String!) {
    ListArticles(
      filter: { articleRepliesFrom: { userId: $userId, exists: true } }
    ) {
      edges {
        node {
          id
          replyRequestCount
          createdAt
          text
          articleReplies(status: NORMAL) {
            replyId
            user {
              id
            }
            ...ArticleReplyData
          }
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ArticleReply.fragments.ArticleReplyData}
  ${LoadMore.fragments.LoadMoreEdge}
`;

const LOAD_REPLIED_ARTICLES_STAT = gql`
  query LoadRepliedArticlesStat($userId: String!) {
    ListArticles(
      filter: { articleRepliesFrom: { userId: $userId, exists: true } }
    ) {
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

function RepliedArticleTab({ userId }) {
  const classes = useStyles();
  const {
    loading,
    fetchMore,
    data: listArticlesData,
    error: listArticlesError,
  } = useQuery(LOAD_REPLIED_ARTICLES, {
    skip: !userId,
    variables: { userId },
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LOAD_REPLIED_ARTICLES_STAT, {
    skip: !userId,
    variables: { userId },
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
