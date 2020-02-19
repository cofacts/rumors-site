import gql from 'graphql-tag';
import querystring from 'querystring';
import { t, ngettext, msgid, jt } from 'ttag';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import url from 'url';
import { useQuery } from '@apollo/react-hooks';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SortIcon from '@material-ui/icons/Sort';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';

import withData from 'lib/apollo';
import { ellipsis } from 'lib/text';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
import SearchInput from 'components/SearchInput';
import FeedDisplay from 'components/FeedDisplay';

const DEFAULT_ORDER_BY = 'lastRequestedAt';
const DEFAULT_STATUS_FILTER = 'unsolved';
const DEFAULT_CATEGORY_IDS = [];
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
 * @param {string|string[]} stringOrArray
 * @returns {string[]}
 */
function getArrayFromQueryParam(stringOrArray) {
  if (typeof stringOrArray === 'string') return [stringOrArray];
  return stringOrArray;
}

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
 * @param {object} urlQuery
 */
function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.before;
  delete urlQuery.after;
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

function ArticleStatusFilter({
  filter = DEFAULT_STATUS_FILTER,
  onChange = () => {},
}) {
  return (
    <ButtonGroup size="small" variant="outlined">
      <Button
        disabled={filter === 'unsolved'}
        onClick={() => onChange('unsolved')}
      >
        {t`Not replied`}
      </Button>
      <Button disabled={filter === 'solved'} onClick={() => onChange('solved')}>
        {t`Replied`}
      </Button>
      <Button disabled={filter === 'all'} onClick={() => onChange('all')}>
        {t`All`}
      </Button>
    </ButtonGroup>
  );
}

/**
 * @param {string[]} props.categoryIds - selected category id
 * @param {Category[]} props.categories - category options
 * @param {(categoryIds: string[]) => void} props.onChange
 */
function CategoryFilter({
  categoryIds = DEFAULT_CATEGORY_IDS,
  categories = [],
  onChange = () => {},
}) {
  return (
    <TextField
      label={t`Category`}
      select
      SelectProps={{
        multiple: true,
        renderValue: selectedIds =>
          selectedIds
            .map(id => categories.find(category => category.id === id)?.title)
            .filter(c => c)
            .join(', '),
      }}
      value={categoryIds}
      onChange={e => onChange(e.target.value)}
    >
      {categories.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          <Checkbox checked={categoryIds.includes(id)} />
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      ))}
    </TextField>
  );
}

function SortInput({ orderBy = DEFAULT_ORDER_BY, onChange = () => {} }) {
  return (
    <TextField
      label={t`Sort by`}
      select
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SortIcon />
          </InputAdornment>
        ),
      }}
      value={orderBy}
      onChange={e => onChange(e.target.value)}
    >
      <MenuItem value="lastRequestedAt">{t`Most recently asked`}</MenuItem>
      <MenuItem value="lastRepliedAt">{t`Most recently replied`}</MenuItem>
      <MenuItem value="replyRequestCount">{t`Most asked`}</MenuItem>
    </TextField>
  );
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
