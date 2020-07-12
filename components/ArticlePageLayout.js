import gql from 'graphql-tag';
import querystring from 'querystring';
import { t, jt } from 'ttag';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { useQuery } from '@apollo/react-hooks';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import { ellipsis } from 'lib/text';
import useCurrentUser from 'lib/useCurrentUser';
import * as FILTERS from 'constants/articleFilters';
import ArticleItem from 'components/ArticleItem';
import FeedDisplay from 'components/FeedDisplay';
import Filters from 'components/ListPageControls/Filters';
import ArticleStatusFilter from 'components/ListPageControls/ArticleStatusFilter';
import CategoryFilter from 'components/ListPageControls/CategoryFilter';
import ReplyTypeFilter from 'components/ListPageControls/ReplyTypeFilter';
import TimeRange from 'components/ListPageControls/TimeRange';
import SortInput from 'components/ListPageControls/SortInput';
import LoadMore from 'components/ListPageControls/LoadMore';

const DEFAULT_REPLY_REQUEST_COUNT = 1;
const MAX_KEYWORD_LENGTH = 100;

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const LIST_ARTICLES = gql`
  query ListArticles(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
    $after: String
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy, after: $after, first: 10) {
      edges {
        node {
          ...ArticleItem
        }
        cursor
      }
    }
  }
  ${ArticleItem.fragments.ArticleItem}
`;

const LIST_STAT = gql`
  query ListArticlesStat(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy, first: 25) {
      pageInfo {
        firstCursor
        lastCursor
      }
      totalCount
    }
  }
`;

const useStyles = makeStyles(() => ({
  filters: {
    margin: '12px 0',
  },
  articleList: {
    padding: 0,
  },
}));

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(
  {
    filters,
    q,
    categoryIds,
    start,
    end,
    replyRequestCount = DEFAULT_REPLY_REQUEST_COUNT,
    searchUserByArticleId,
    types,
  } = {},
  { defaultFilters = [], timeRangeKey = 'createdAt', user }
) {
  const filterObj = {};

  if (q) {
    filterObj.moreLikeThis = {
      like: q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '0',
    };
  }

  filterObj.replyRequestCount = { GTE: replyRequestCount };

  if (categoryIds) {
    filterObj.categoryIds = categoryIds.split(',');
  }

  const selectedFilters = filters ? filters.split(',') : defaultFilters;
  selectedFilters.forEach(filter => {
    switch (filter) {
      case FILTERS.REPLIED_BY_ME:
        if (!user) break;
        filterObj.articleRepliesFrom = {
          userId: user.id,
          exists: true,
        };
        break;
      case FILTERS.NO_USEFUL_REPLY_YET:
        filterObj.hasArticleReplyWithMorePositiveFeedback = false;
        break;
      case FILTERS.ASKED_MANY_TIMES:
        filterObj.replyRequestCount = { GTE: 2 };
        break;
      case FILTERS.REPLIED_MANY_TIMES:
        filterObj.replyCount = { GTE: 3 };
        break;
      default:
    }
  });

  if (searchUserByArticleId) {
    filterObj.fromUserOfArticleId = searchUserByArticleId;
  }

  if (start) {
    filterObj[timeRangeKey] = { ...filterObj[timeRangeKey], GTE: start };
  }
  if (end) {
    filterObj[timeRangeKey] = { ...filterObj[timeRangeKey], LTE: end };
  }

  if (types) {
    filterObj.replyTypes = types.split(',');
  }

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }
  return filterObj;
}

/**
 * @param {object} urlQuery - URL query object
 * @returns {object[]} ListArticleOrderBy array
 */
function urlQuery2OrderBy({ orderBy } = {}, defaultOrder) {
  const key = orderBy || defaultOrder;
  return [{ [key]: 'DESC' }];
}

/**
 *
 * @param {object} query
 * @returns {object}
 */
export function getQueryVars(query, option) {
  return {
    filter: urlQuery2Filter(query, {
      defaultFilters: option?.filters,
      timeRangeKey: option?.timeRangeKey,
      user: option?.user,
    }),
    orderBy: urlQuery2OrderBy(query, option?.order),
  };
}

function ArticlePageLayout({
  title,
  articleDisplayConfig = {},
  defaultOrder = 'lastRequestedAt',
  defaultFilters = [],
  timeRangeKey = 'createdAt',
  options = {
    filters: true,
    consider: true,
    category: true,
  },
}) {
  const classes = useStyles();
  const { query } = useRouter();
  const user = useCurrentUser();
  const listQueryVars = getQueryVars(query, {
    filters: defaultFilters,
    order: defaultOrder,
    timeRangeKey,
    user,
  });

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

  // Flags
  const searchedArticleEdge = articleEdges.find(
    ({ node: { id } }) => id === query.searchUserByArticleId
  );
  const searchedUserArticleElem = (
    <mark key="searched-user">
      {ellipsis(searchedArticleEdge?.node?.text || '', { wordCount: 15 })}
    </mark>
  );

  const queryString = querystring.stringify(query);
  return (
    <Box pt={2}>
      {query.searchUserByArticleId && (
        <h1>{jt`Messages reported by user that reported “${searchedUserArticleElem}”`}</h1>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: 'center', md: 'space-between' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        mb={2}
      >
        <Typography variant="h4">{title}</Typography>
        <Box my={1}>
          <FeedDisplay
            feedUrl={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <TimeRange />
        <SortInput
          defaultOrderBy={defaultOrder}
          options={[
            { value: 'lastRequestedAt', label: t`Most recently asked` },
            { value: 'lastRepliedAt', label: t`Most recently replied` },
            { value: 'replyRequestCount', label: t`Most asked` },
          ]}
        />
      </Box>

      <Filters className={classes.filters}>
        {options.filters && <ArticleStatusFilter />}
        {options.consider && <ReplyTypeFilter />}
        {options.category && <CategoryFilter />}
      </Filters>

      {loading && !articleEdges.length ? (
        t`Loading...`
      ) : listArticlesError ? (
        listArticlesError.toString()
      ) : (
        <>
          <ul className={classes.articleList}>
            {articleEdges.map(({ node }) => (
              <ArticleItem
                key={node.id}
                article={node}
                query={query.q}
                {...articleDisplayConfig}
              />
            ))}
          </ul>

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
    </Box>
  );
}

export default ArticlePageLayout;
