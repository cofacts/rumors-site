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
import {
  ListPageCards,
  ListPageCard,
  ReplyItem,
} from 'components/ListPageDisplays';
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
            user {
              id
            }
            reply {
              id
              ...ReplyItem
            }
            ...ReplyItemArticleReplyData
          }
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ReplyItem.fragments.ReplyItem}
  ${ReplyItem.fragments.ReplyItemArticleReplyData}
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
    fontSize: theme.typography.htmlFontSize,
    textAlign: 'center',
    position: 'relative', // For ::before
    zIndex: 0, // Make a stacking context
    margin: '8px 0 -8px',

    '&:before': {
      position: 'absolute',
      top: '50%',
      display: 'block',
      height: '1px',
      zIndex: -1,
      width: '100%',
      backgroundColor: theme.palette.secondary[100],
      content: '""',
    },
    '& a': {
      display: 'inline-block',
      borderRadius: 30,
      padding: '10px 26px',
      fontSize: 14,
      lineHeight: '16px',
      textAlign: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      border: `5px solid ${theme.palette.common.white}`,
      [theme.breakpoints.up('md')]: {
        fontSize: 16,
      },
    },
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
    variables: { userId },
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LOAD_REPLIED_ARTICLES_STAT);

  // List data
  const articleEdges = listArticlesData?.ListArticles?.edges || [];
  const statsData = listStatData?.ListArticles || {};

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
          <ListPageCards>
            {articleEdges.map(({ node: article }) => (
              <ListPageCard key={article.id}>
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

                <div
                  className={classes.bustHoaxDivider}
                  data-ga="Bust hoax button"
                >
                  <Link href="/article/[id]" as={`/article/${article.id}`}>
                    <a>{t`Bust Hoaxes`}</a>
                  </Link>
                </div>

                {article.articleReplies
                  .filter(articleReply => userId === articleReply.user.id)
                  .map(({ reply, ...articleReply }) => (
                    <ReplyItem
                      key={reply.id}
                      articleReply={articleReply}
                      reply={reply}
                    />
                  ))}
              </ListPageCard>
            ))}
          </ListPageCards>

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
