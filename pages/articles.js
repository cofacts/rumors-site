import gql from 'graphql-tag';
import querystring from 'querystring';
import { t, ngettext, msgid, jt } from 'ttag';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { useQuery } from '@apollo/react-hooks';
import withData from 'lib/apollo';
import { ellipsis } from 'lib/text';
import {
  goToUrlQueryAndResetPagination,
  getArrayFromQueryParam,
} from 'lib/url';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
import SearchInput from 'components/SearchInput';
import FeedDisplay from 'components/FeedDisplay';
import {
  ArticleStatusFilter,
  CategoryFilter,
  SortInput,
  DEFAULT_STATUS_FILTER,
  DEFAULT_CATEGORY_IDS,
  DEFAULT_ORDER_BY,
} from 'components/ArticleListPage';

const DEFAULT_REPLY_REQUEST_COUNT = 2;
const MAX_KEYWORD_LENGTH = 100;

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const LIST_ARTICLES = gql`
  query ListArticles(
    $filter: ListArticleFilter
    $orderBy: [ListArticleOrderBy]
    $before: String
    $after: String
  ) {
    ListArticles(
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      first: 25
    ) {
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

const LIST_CATEGORIES = gql`
  query ListCategoriesOnArticleList {
    ListCategories(first: 50) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter({
  filter = DEFAULT_STATUS_FILTER,
  q,
  replyRequestCount = DEFAULT_REPLY_REQUEST_COUNT,
  c = DEFAULT_CATEGORY_IDS,
  searchUserByArticleId,
} = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = {
      like: q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '0',
    };
  }

  filterObj.replyRequestCount = { GT: replyRequestCount - 1 };

  if (filter === 'solved') {
    filterObj.replyCount = { GT: 0 };
  } else if (filter === 'unsolved') {
    filterObj.replyCount = { EQ: 0 };
  }

  if (searchUserByArticleId) {
    filterObj.fromUserOfArticleId = searchUserByArticleId;
  }

  const categoryIds = getArrayFromQueryParam(c || []);
  if (categoryIds.length > 0) {
    filterObj.categoryIds = categoryIds;
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
function urlQuery2OrderBy({ q, orderBy = DEFAULT_ORDER_BY } = {}) {
  // If there is query text, sort by _score first

  if (q) {
    return [{ _score: 'DESC' }, { [orderBy]: 'DESC' }];
  }

  return [{ [orderBy]: 'DESC' }];
}

/**
 *
 * @param {object} query
 * @returns {object}
 */
export function getQueryVars(query) {
  return {
    filter: urlQuery2Filter(query),
    orderBy: urlQuery2OrderBy(query),
  };
}

function ArticleListPage() {
  const { query } = useRouter();

  const listQueryVars = getQueryVars(query);

  const {
    loading,
    data: { ListArticles: articleData },
  } = useQuery(LIST_ARTICLES, {
    variables: {
      ...listQueryVars,
      before: query.before,
      after: query.after,
    },
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const {
    loading: statsLoading,
    data: { ListArticles: statsData },
  } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  // This query should fire only once on client side and never gets re-fetched
  //
  const {
    data: { ListCategories: categoriesData },
  } = useQuery(LIST_CATEGORIES, { ssr: false });

  const showOneTimeMessages = +query.replyRequestCount === 1;
  const searchedArticleEdge = (articleData?.edges || []).find(
    ({ node: { id } }) => id === query.searchUserByArticleId
  );
  const searchedUserArticleElem = (
    <mark>
      {ellipsis(searchedArticleEdge?.node?.text || '', { wordCount: 15 })}
    </mark>
  );

  const queryString = querystring.stringify(query);
  return (
    <AppLayout>
      <Head>
        <title>{t`Article list`}</title>
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${PUBLIC_URL}/api/articles/atom1?${queryString}`}
        />
      </Head>

      {query.searchUserByArticleId && (
        <h1>{jt`Messages reported by user that reported “${searchedUserArticleElem}”`}</h1>
      )}

      <Grid container spacing={2}>
        <Grid item>
          <ArticleStatusFilter
            filter={query.filter}
            onChange={filter =>
              goToUrlQueryAndResetPagination({ ...query, filter })
            }
          />
        </Grid>
        <Grid item>
          <CategoryFilter
            categoryIds={getArrayFromQueryParam(query.c || [])}
            categories={categoriesData?.edges?.map(({ node }) => node) || []}
            onChange={categoryIds =>
              goToUrlQueryAndResetPagination({
                ...query,
                c: categoryIds,
              })
            }
          />
        </Grid>
        <Grid item style={{ marginRight: 'auto' }}>
          <SearchInput
            q={query.q}
            onChange={q => goToUrlQueryAndResetPagination({ ...query, q })}
          />
        </Grid>
        <Grid item>
          <FeedDisplay
            feedUrl={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOneTimeMessages}
            onChange={e =>
              goToUrlQueryAndResetPagination({
                ...query,
                replyRequestCount: e.target.checked ? 1 : 2,
              })
            }
          />
        }
        label={t`Include messages reported only 1 time`}
      />
      <div>
        {query.q ? (
          t`Sort by Relevance`
        ) : (
          <SortInput
            orderBy={query.orderBy}
            onChange={orderBy =>
              goToUrlQueryAndResetPagination({ ...query, orderBy })
            }
          />
        )}
      </div>
      <p>
        {statsLoading
          ? 'Loading...'
          : ngettext(
              msgid`${statsData.totalCount} collected message`,
              `${statsData.totalCount} collected messages`,
              statsData.totalCount
            )}
      </p>

      {loading ? (
        'Loading....'
      ) : (
        <>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={articleData?.edges}
          />
          <ul className="article-list">
            {articleData.edges.map(({ node }) => {
              return <ArticleItem key={node.id} article={node} />;
            })}
          </ul>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={articleData?.edges}
          />
          {!showOneTimeMessages && (
            <Typography variant="body2" component="p">
              {t`Shows messages reported multiple times by default.`}{' '}
              <a
                href="javascript:;"
                onClick={() =>
                  goToUrlQueryAndResetPagination({
                    ...query,
                    replyRequestCount: 1,
                  })
                }
              >
                {t`Click here to include messages only reported 1 time.`}
              </a>
            </Typography>
          )}
        </>
      )}
      <style jsx>
        {`
          .article-list {
            padding: 0;
            list-style: none;
          }
        `}
      </style>
    </AppLayout>
  );
}

export default withData(ArticleListPage);
