import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';

import AppLayout from 'components/AppLayout';
import FeedDisplay from 'components/Subscribe/FeedDisplay';
import {
  ListPageCards,
  ArticleCard,
  ListPageHeader,
} from 'components/ListPageDisplays';
import {
  Tools,
  Filters,
  CategoryFilter,
  TimeRange,
  LoadMore,
} from 'components/ListPageControls';
import withData from 'lib/apollo';

const LIST_ARTICLES = gql`
  query GetHoaxForYouList(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
    $after: String
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy, after: $after, first: 25) {
      edges {
        node {
          id
          ...ArticleCard
        }
        ...LoadMoreEdge
      }
    }
  }
  ${ArticleCard.fragments.ArticleCard}
  ${LoadMore.fragments.LoadMoreEdge}
`;

const LIST_STAT = gql`
  query GetHoaxForYouStat(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
  ) {
    ListArticles(filter: $filter, orderBy: $orderBy) {
      ...LoadMoreConnectionForStats
    }
  }
  ${LoadMore.fragments.LoadMoreConnectionForStats}
`;

/**
 * @param {object} query - URL query object
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(query = {}) {
  const filterObj = {
    // Default filters
    replyRequestCount: { GTE: 2 },
    hasArticleReplyWithMorePositiveFeedback: false,
  };

  const selectedCategoryIds = CategoryFilter.getValues(query);
  if (selectedCategoryIds.length) filterObj.categoryIds = selectedCategoryIds;

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

function HoaxForYouPage() {
  const { query } = useRouter();

  const listQueryVars = {
    filter: urlQuery2Filter(query),
    orderBy: [{ lastRequestedAt: 'DESC' }],
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
        <title>{t`Hoax for you`}</title>
      </Head>
      <ListPageHeader title={t`Hoax for you`}>
        <FeedDisplay listQueryVars={listQueryVars} />
      </ListPageHeader>

      <Tools>
        <TimeRange />
      </Tools>

      <Filters>
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
              <ArticleCard key={article.id} article={article} query={query.q} />
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
    </AppLayout>
  );
}

export default withData(HoaxForYouPage);
