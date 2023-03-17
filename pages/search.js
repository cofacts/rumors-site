import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';

import Box from '@material-ui/core/Box';
import { Container } from '@material-ui/core';

import * as FILTERS from 'constants/articleFilters';
import {
  ListPageCards,
  ArticleCard,
  ReplySearchItem,
} from 'components/ListPageDisplays';
import {
  Tools,
  Filters,
  getArticleStatusFilter,
  getArticleStatusFilterValues,
  ArticleStatusFilter,
  CategoryFilter,
  ReplyTypeFilter,
  TimeRange,
  LoadMore,
} from 'components/ListPageControls';
import AppLayout from 'components/AppLayout';
import SearchPageJumbotron from 'components/SearchPageJumbotron';
import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';

const MAX_KEYWORD_LENGTH = 500;

const LIST_ARTICLES = gql`
  query ArticleSearchResult($filter: ListArticleFilter, $after: String) {
    ListArticles(
      filter: $filter
      orderBy: [{ _score: DESC }]
      after: $after
      first: 25
    ) {
      edges {
        node {
          id
          replyRequestCount
          createdAt
          text
          ...ArticleCard
        }
        highlight {
          ...HighlightFields
        }
        cursor
      }
    }
  }
  ${ArticleCard.fragments.ArticleCard}
  ${ArticleCard.fragments.Highlight}
`;

const LIST_REPLIES = gql`
  query ReplySearchResult($filter: ListReplyFilter, $after: String) {
    ListReplies(
      filter: $filter
      orderBy: [{ _score: DESC }]
      after: $after
      first: 10
    ) {
      edges {
        node {
          ...ReplySearchItem
        }
        highlight {
          ...HighlightFields
        }
        cursor
      }
    }
  }
  ${ReplySearchItem.fragments.ReplySearchItem}
  ${ReplySearchItem.fragments.Highlight}
`;

const LIST_ARTICLE_STAT = gql`
  query ArticleSearchResultStat($filter: ListArticleFilter) {
    ListArticles(filter: $filter, orderBy: [{ _score: DESC }], first: 25) {
      pageInfo {
        firstCursor
        lastCursor
      }
      totalCount
    }
  }
`;

const LIST_REPLY_STAT = gql`
  query ReplySearchResultStat($filter: ListReplyFilter) {
    ListReplies(filter: $filter, orderBy: [{ _score: DESC }], first: 25) {
      pageInfo {
        firstCursor
        lastCursor
      }
      totalCount
    }
  }
`;

/**
 * Filters that is common across ListAriticleFilter and ListReplyFilter
 *
 * @param {object} query - URL query object
 * @returns {object} ListArticleFilter & ListReplyFilter
 */
function urlQuery2Filter(query = {}) {
  const filterObj = {
    moreLikeThis: {
      like: query.q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '1',
    },
  };

  const [start, end] = TimeRange.getValues(query);

  if (start) {
    filterObj.createdAt = { ...filterObj.createdAt, GTE: start };
  }
  if (end) {
    filterObj.createdAt = { ...filterObj.createdAt, LTE: end };
  }

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }

  return filterObj;
}

/**
 * Search for matching articles and list the result
 *
 * @param {object} props.query - URL param object
 * @param {string?} props.userId - Currently logged in userId
 */
function MessageSearchResult({ query, userId }) {
  const replyTypes = ReplyTypeFilter.getValues(query);
  const listQueryVars = {
    filter: {
      ...urlQuery2Filter(query),
      ...getArticleStatusFilter(query, userId),
      categoryIds: CategoryFilter.getValues(query),
      ...(replyTypes.length ? { replyTypes } : {}),
    },
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
  const { data: listStatData } = useQuery(LIST_ARTICLE_STAT, {
    variables: listQueryVars,
  });

  // List data
  const articleEdges = listArticlesData?.ListArticles?.edges || [];
  const statsData = listStatData?.ListArticles || {};

  if (loading && !articleEdges.length) return t`Loading...`;
  if (listArticlesError) return listArticlesError.toString();

  return (
    <>
      <ListPageCards>
        {articleEdges.map(({ node: article, highlight }) => (
          <ArticleCard
            key={article.id}
            article={article}
            highlight={highlight}
          />
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
  );
}

/**
 * Search for matching replies and list the result
 *
 * @param {object} props.query - URL param object
 * @param {boolean} props.isLoggedIn
 */
function ReplySearchResult({ query, isLoggedIn }) {
  const types = ReplyTypeFilter.getValues(query);
  const articleStatusValues = getArticleStatusFilterValues(query);
  const listQueryVars = {
    filter: {
      ...urlQuery2Filter(query),
      ...(types.length ? { types } : {}),
      selfOnly:
        isLoggedIn && articleStatusValues.includes(FILTERS.REPLIED_BY_ME),
    },
  };

  const {
    loading,
    fetchMore,
    data: listRepliesData,
    error: listRepliesError,
  } = useQuery(LIST_REPLIES, {
    variables: listQueryVars,
    notifyOnNetworkStatusChange: true, // Make loading true on `fetchMore`
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LIST_REPLY_STAT, {
    variables: listQueryVars,
  });

  // List data
  const replyEdges = listRepliesData?.ListReplies?.edges || [];
  const statsData = listStatData?.ListReplies || {};

  if (loading && !replyEdges.length) return t`Loading...`;
  if (listRepliesError) return listRepliesError.toString();

  return (
    <>
      <Box component="ul" p={0}>
        {replyEdges.map(({ node, highlight }) => (
          <ReplySearchItem key={node.id} {...node} highlight={highlight} />
        ))}
      </Box>

      <LoadMore
        edges={replyEdges}
        pageInfo={statsData?.pageInfo}
        loading={loading}
        onMoreRequest={args =>
          fetchMore({
            variables: args,
            updateQuery(prev, { fetchMoreResult }) {
              if (!fetchMoreResult) return prev;
              const newData = fetchMoreResult?.ListReplies;
              return {
                ...prev,
                ListReplies: {
                  ...newData,
                  edges: [...replyEdges, ...newData.edges],
                },
              };
            },
          })
        }
      />
    </>
  );
}

// Only "reply by me" filter for filter search
const ARTICLE_STATUS_FILTER_MAP_FOR_REPLIES = {
  ...Object.fromEntries(Object.keys(FILTERS).map(key => [key, false])),
  [FILTERS.REPLIED_BY_ME]: true,
  [FILTERS.NOT_REPLIED_BY_ME]: true,
};

function SearchPage() {
  const { query } = useRouter();
  const user = useCurrentUser();

  return (
    <AppLayout container={false}>
      <Head>
        <title>{t`Search`}</title>
      </Head>

      <SearchPageJumbotron />

      <Container>
        <Tools>
          <TimeRange />
        </Tools>

        <Filters>
          <ArticleStatusFilter
            filterMap={
              query.type === 'replies'
                ? ARTICLE_STATUS_FILTER_MAP_FOR_REPLIES
                : undefined
            }
          />
          <ReplyTypeFilter />
          {query.type === 'messages' && <CategoryFilter />}
        </Filters>
        {query.type === 'messages' && (
          <MessageSearchResult query={query} userId={user?.id} />
        )}
        {query.type === 'replies' && (
          <ReplySearchResult query={query} isLoggedIn={!!user} />
        )}
      </Container>
    </AppLayout>
  );
}

export default withData(SearchPage);
