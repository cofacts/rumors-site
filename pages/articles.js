import gql from 'graphql-tag';
import { t, ngettext, msgid, jt } from 'ttag';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
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

import withData from 'lib/apollo';
import { ellipsis } from 'lib/text';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
import SearchInput from 'components/SearchInput';

const DEFAULT_ORDER_BY = 'lastRequestedAt';
const DEFAULT_TYPE_FILTER = 'unsolved';
const DEFAULT_REPLY_REQUEST_COUNT = 2;

export const LIST_ARTICLES = gql`
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

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListArticleFilter
 */
function urlQuery2Filter({
  filter = DEFAULT_TYPE_FILTER,
  q,
  replyRequestCount = DEFAULT_REPLY_REQUEST_COUNT,
  searchUserByArticleId,
} = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
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

function ArticleFilter({ filter = DEFAULT_TYPE_FILTER, onChange = () => {} }) {
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
      <MenuItem value="replyRequestCount">{t`Most asked`}</MenuItem>
    </TextField>
  );
}

function ArticleListPage() {
  const { query } = useRouter();

  const listQueryVars = {
    filter: urlQuery2Filter(query),
    orderBy: urlQuery2OrderBy(query),
  };

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

  const showOneTimeMessages = +query.replyRequestCount === 1;
  const searchedArticleEdge = (articleData?.edges || []).find(
    ({ node: { id } }) => id === query.searchUserByArticleId
  );
  const searchedUserArticleElem = (
    <mark>
      {ellipsis(searchedArticleEdge?.node?.text || '', { wordCount: 15 })}
    </mark>
  );

  return (
    <AppLayout>
      <Head>
        <title>{t`Article list`}</title>
      </Head>

      {query.searchUserByArticleId && (
        <h1>{jt`Messages reported by user that reported “${searchedUserArticleElem}”`}</h1>
      )}

      <Grid container spacing={2}>
        <Grid item>
          <ArticleFilter
            filter={query.filter}
            onChange={filter =>
              goToUrlQueryAndResetPagination({ ...query, filter })
            }
          />
        </Grid>
        <Grid item>
          <SearchInput
            q={query.q}
            onChange={q => goToUrlQueryAndResetPagination({ ...query, q })}
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
