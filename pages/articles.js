import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import Router from 'next/router';
import url from 'url';
import { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import withData from 'lib/apollo';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';

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
          id
          text
          replyCount
          replyRequestCount
          createdAt
          references {
            type
          }
        }
        cursor
      }
    }
  }
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
  filter,
  q,
  replyRequestCount,
  searchUserByArticleId,
} = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  filterObj.replyRequestCount = { GT: (replyRequestCount || 2) - 1 };

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
function urlQuery2OrderBy({ q, orderBy = 'createdAt' } = {}) {
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

function ArticleFilter({ filter = 'unsolved', onChange = () => {} }) {
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

function SearchInput({ q = '', onChange = () => {} }) {
  const handleSubmit = useCallback(e => onChange(e.target.value), [onChange]);
  const handleKeyUp = useCallback(e => {
    e.which === 13 && e.target.blur();
  }, []);

  return (
    <Input
      defaultValue={q}
      onBlur={handleSubmit}
      onKeyUp={handleKeyUp}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
    />
  );
}

function ArticleListPage({ query }) {
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

  return (
    <AppLayout>
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

// Expose path query to component
ArticleListPage.getInitialProps = ({ query }) => ({ query });

export default withData(ArticleListPage);
