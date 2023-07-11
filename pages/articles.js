import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { t } from 'ttag';
import { useQuery } from '@apollo/react-hooks';

import useCurrentUser from 'lib/useCurrentUser';
import {
  ListPageCards,
  ArticleCard,
  ListPageHeader,
} from 'components/ListPageDisplays';
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
import withData from 'lib/apollo';

const LIST_ARTICLES = gql`
  query GetArticlesList(
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
  query GetArticlesListStat(
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
 * @param {object} urlQuery - URL query object and urserId
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter({ userId, ...query } = {}) {
  const filterObj = getArticleStatusFilter(query, userId);

  const selectedCategoryIds = CategoryFilter.getValues(query);
  if (selectedCategoryIds.length) filterObj.categoryIds = selectedCategoryIds;

  const [start, end] = TimeRange.getValues(query);

  if (start) {
    filterObj.createdAt = { ...filterObj.createdAt, GTE: start };
  }
  if (end) {
    filterObj.createdAt = { ...filterObj.createdAt, LTE: end };
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

const DEFAULT_ORDER = 'lastRequestedAt';

function ArticleListPage() {
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
        <title>{t`Dubious Messages`}</title>
      </Head>
      <ListPageHeader title={t`Dubious Messages`}>
        <FeedDisplay listQueryVars={listQueryVars} />
      </ListPageHeader>

      <Tools>
        <TimeRange />
        <SortInput
          defaultOrderBy={DEFAULT_ORDER}
          options={[
            { value: 'lastRequestedAt', label: t`Most recently asked` },
            { value: 'replyRequestCount', label: t`Most asked` },
            { value: 'lastRepliedAt', label: t`Most recently replied` },
          ]}
        />
      </Tools>

      <Filters>
        <ArticleStatusFilter />
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
              <ArticleCard key={article.id} article={article} />
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

export default withData(ArticleListPage);
