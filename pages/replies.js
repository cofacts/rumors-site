import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import Head from 'next/head';
import { t, ngettext, msgid } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'lib/useCurrentUser';
import * as FILTERS from 'constants/articleFilters';
import {
  ListPageCards,
  ListPageCard,
  ListPageHeader,
  ReplyItem,
} from 'components/ListPageDisplays';
import Infos from 'components/Infos';
import TimeInfo from 'components/Infos/TimeInfo';
import ExpandableText from 'components/ExpandableText';
import {
  Tools,
  Filters,
  ArticleStatusFilter,
  getArticleStatusFilter,
  CategoryFilter,
  ArticleTypeFilter,
  ReplyTypeFilter,
  TimeRange,
  SortInput,
  LoadMore,
} from 'components/ListPageControls';
import FeedDisplay from 'components/Subscribe/FeedDisplay';
import AppLayout from 'components/AppLayout';
import Thumbnail from 'components/Thumbnail';
import withData from 'lib/apollo';

const LIST_ARTICLES = gql`
  query GetRepliesList(
    $filter: ListArticleFilter
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
            reply {
              id
              ...ReplyItem
            }
            ...ReplyItemArticleReplyData
          }
        }
        cursor
      }
    }
  }
  ${ReplyItem.fragments.ReplyItem}
  ${ReplyItem.fragments.ReplyItemArticleReplyData}
  ${Thumbnail.fragments.ThumbnailArticleData}
`;

const LIST_STAT = gql`
  query GetRepliesListStat(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy) {
      pageInfo {
        firstCursor
        lastCursor
      }
      totalCount
    }
  }
`;

/** Toggle options in ArticleStatusFilter */
const ARTICLE_STATUS_FILTER_MAP = {
  [FILTERS.NO_REPLY]: false,
};

/**
 * @param {object} urlQuery - URL query object and urserId
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter({ userId, ...query } = {}) {
  const filterObj = getArticleStatusFilter(query, userId);

  // Default filters
  if (!filterObj.replyCount) {
    filterObj.replyCount = { GTE: 1 };
  }

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

  const articleTypes = ArticleTypeFilter.getValues(query);
  if (articleTypes.length) filterObj.articleTypes = articleTypes;

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }

  return filterObj;
}

const REPLIES_ORDER = [
  { value: 'lastRepliedAt', label: t`Most recently replied` },
  { value: 'lastRequestedAt', label: t`Most recently asked` },
  { value: 'replyRequestCount', label: t`Most asked` },
];
const DEFAULT_ORDER = REPLIES_ORDER[0].value;

const useStyles = makeStyles((theme) => ({
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

function ReplyListPage() {
  const classes = useStyles();
  const { query } = useRouter();
  const user = useCurrentUser();

  const listQueryVars = {
    filter: urlQuery2Filter({
      ...query,
      userId: user?.id,
    }),
    orderBy: [{ [SortInput.getValue(query) || DEFAULT_ORDER]: 'DESC' }],
  };

  const {
    loading,
    fetchMore,
    data: listArticlesData,
    error: listArticlesError,
  } = useQuery(LIST_ARTICLES, {
    variables: listQueryVars,
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  // List data
  const articleEdges = listArticlesData?.ListArticles?.edges || [];
  const statsData = listStatData?.ListArticles || {};

  return (
    <AppLayout>
      <Head>
        <title>{t`Latest replies`}</title>
      </Head>

      <ListPageHeader title={t`Latest replies`}>
        <FeedDisplay listQueryVars={listQueryVars} />
      </ListPageHeader>

      <Tools>
        <TimeRange />
        <SortInput defaultOrderBy={DEFAULT_ORDER} options={REPLIES_ORDER} />
      </Tools>

      <Filters>
        <ArticleStatusFilter filterMap={ARTICLE_STATUS_FILTER_MAP} />
        <ArticleTypeFilter />
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
                    {(timeAgo) => t`First reported ${timeAgo}`}
                  </TimeInfo>
                </Infos>
                <Thumbnail article={article} />
                {article.text && (
                  <ExpandableText lineClamp={2}>{article.text}</ExpandableText>
                )}
                <div
                  className={classes.bustHoaxDivider}
                  data-ga="Bust hoax button"
                >
                  <Link href="/article/[id]" as={`/article/${article.id}`}>
                    <a>{t`Bust Hoaxes`}</a>
                  </Link>
                </div>

                {article.articleReplies
                  .slice(0, 5)
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
            onMoreRequest={(args) =>
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
    </AppLayout>
  );
}

export default withData(ReplyListPage);
