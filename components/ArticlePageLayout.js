import gql from 'graphql-tag';
import querystring from 'querystring';
import { t, jt } from 'ttag';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import url from 'url';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import withData from 'lib/apollo';
import { ellipsis } from 'lib/text';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
import FeedDisplay from 'components/FeedDisplay';
import Filters, { Filter } from 'components/Filters';
import TimeRange from 'components/TimeRange';
import SortInput from 'components/SortInput';

const STATUSES = ['unsolved', 'solved', 'all'];
const DEFAULT_REPLY_REQUEST_COUNT = 1;
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

const useStyles = makeStyles({
  filters: {
    padding: '12px 0',
  },
  articleList: {
    padding: 0,
  },
});

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter(
  {
    filter,
    q,
    start,
    end,
    replyRequestCount = DEFAULT_REPLY_REQUEST_COUNT,
    searchUserByArticleId,
  } = {},
  defaultStatus = 'unsolved'
) {
  const status = filter || defaultStatus;

  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = {
      like: q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '0',
    };
  }

  filterObj.replyRequestCount = { GT: replyRequestCount - 1 };

  if (status === 'solved') {
    filterObj.replyCount = { GT: 0 };
  } else if (status === 'unsolved') {
    filterObj.replyCount = { EQ: 0 };
  }

  if (searchUserByArticleId) {
    filterObj.fromUserOfArticleId = searchUserByArticleId;
  }

  if (start) {
    filterObj.createdAt = { GT: start };
    if (end) {
      filterObj.createdAt.LTE = end;
    }
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
 * @param {object} urlQuery
 */
function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.before;
  delete urlQuery.after;
  urlQuery = Object.fromEntries(
    Object.entries(urlQuery).filter(entry => !!entry[1])
  );
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

/**
 *
 * @param {object} query
 * @returns {object}
 */
export function getQueryVars(query, option) {
  return {
    filter: urlQuery2Filter(query, option?.filter),
    orderBy: urlQuery2OrderBy(query, option?.order),
  };
}

function ArticlePageLayout({
  title,
  articleDisplayConfig = {},
  defaultOrder = 'lastRequestedAt',
  defaultStatus = 'unsolved',
  filters = { status: true, consider: true, category: true },
}) {
  const classes = useStyles();

  const { query } = useRouter();

  const listQueryVars = getQueryVars(query, {
    filter: defaultStatus,
    order: defaultOrder,
  });

  const {
    loading,
    data: listArticlesData,
    error: listArticlesError,
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
  const { data: listStatData } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  // List data
  const statsData = listStatData?.ListArticles || {};
  const articleEdges = listArticlesData?.ListArticles?.edges || [];

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
    <AppLayout>
      <Head>
        <title>{title}</title>
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

      <Grid container alignItems="center" justify="space-between" spacing={2}>
        <Grid item xs={12} lg="auto">
          <Typography variant="h4">{t`Messages`}</Typography>
        </Grid>
        <Grid item xs={12} lg="auto">
          <FeedDisplay
            feedUrl={`${PUBLIC_URL}/api/articles/rss2?${queryString}`}
          />
        </Grid>
      </Grid>

      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <TimeRange
            range={listQueryVars?.filter?.createdAt}
            onChange={createdAt =>
              goToUrlQueryAndResetPagination({
                ...query,
                start: createdAt?.GT,
                end: createdAt?.LTE,
              })
            }
          />
        </Grid>
        <Grid item>
          <SortInput
            orderBy={query.orderBy || defaultOrder}
            onChange={orderBy =>
              goToUrlQueryAndResetPagination({ ...query, orderBy })
            }
            options={[
              { value: 'lastRequestedAt', label: t`Most recently asked` },
              { value: 'lastRepliedAt', label: t`Most recently replied` },
              { value: 'replyRequestCount', label: t`Most asked` },
            ]}
          />
        </Grid>
      </Grid>

      <Filters className={classes.filters}>
        {filters.status && (
          <Filter
            title={t`Filter`}
            options={STATUSES.map(status => ({
              label: status,
              value: status,
              // @todo: fix initial load filter is undefined issue
              selected: status === (query.filter || defaultStatus),
            }))}
            onChange={filter =>
              goToUrlQueryAndResetPagination({
                ...query,
                filter,
              })
            }
          />
        )}

        {/* not implemented yet
        {filters.consider && (
          <Filter
            title={t`Consider`}
            multiple
          />
        )}

        */}
        {/* not implemented yet
        {filters.category && (
          <Filter
            title={t`Topic`}
            multiple
            expandable
            onlySelected
            placeholder={`All Topics`}
            options={TOPICS.map(topic => ({
              label: topic,
              value: topic,
              selected: false,
            }))}
          />
        )}
        */}
      </Filters>

      {loading ? (
        'Loading....'
      ) : listArticlesError ? (
        listArticlesError.toString()
      ) : (
        <>
          <ul className={classes.articleList}>
            {articleEdges.map(({ node }) => (
              <ArticleItem
                key={node.id}
                article={node}
                {...articleDisplayConfig}
              />
            ))}
          </ul>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={articleEdges}
          />
        </>
      )}
    </AppLayout>
  );
}

export default withData(ArticlePageLayout);
