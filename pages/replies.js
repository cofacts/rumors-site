import gql from 'graphql-tag';
import React from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { t, ngettext, msgid } from 'ttag';
import url from 'url';

import { useQuery } from '@apollo/react-hooks';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SortIcon from '@material-ui/icons/Sort';
import FilterListIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';
import AppLayout from 'components/AppLayout';
import Pagination from 'components/Pagination';
import SearchInput from 'components/SearchInput';
import ReplyItem from 'components/ReplyItem';
import { TYPE_NAME } from 'constants/replyType';

const DEFAULT_ORDER_BY = 'createdAt_DESC';
const DEFAULT_TYPE_FILTER = 'all';

const LIST_REPLIES = gql`
  query ListReplies(
    $filter: ListReplyFilter
    $orderBy: [ListReplyOrderBy]
    $before: String
    $after: String
  ) {
    ListReplies(
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      first: 25
    ) {
      edges {
        node {
          ...ReplyItem
        }
        cursor
      }
    }
  }
  ${ReplyItem.fragments.ReplyItem}
`;

const LIST_STAT = gql`
  query ListRepliesStat(
    $filter: ListReplyFilter
    $orderBy: [ListReplyOrderBy]
  ) {
    ListReplies(filter: $filter, orderBy: $orderBy, first: 25) {
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
 * @returns {object} ListReplyFilter
 */
function urlQuery2Filter({ filter = DEFAULT_TYPE_FILTER, q, mine } = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  if (filter && filter !== 'all') {
    filterObj.type = filter;
  }

  if (mine) {
    filterObj.selfOnly = true;
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
  const [orderByItem, order] = orderBy.split('_');

  // If there is query text, sort by _score first

  if (q) {
    return [{ _score: 'DESC' }, { [orderByItem]: order }];
  }

  return [{ [orderByItem]: order }];
}

/**
 * @param {object} urlQuery
 */
function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.before;
  delete urlQuery.after;
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

function ReplyFilter({ filter = DEFAULT_TYPE_FILTER, onChange = () => {} }) {
  return (
    <TextField
      select
      value={filter}
      onChange={e => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterListIcon />
          </InputAdornment>
        ),
      }}
    >
      <MenuItem value="all">{t`All replies`}</MenuItem>
      {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type => (
        <MenuItem key={type} value={type}>
          {TYPE_NAME[type]}
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
      <MenuItem value="createdAt_DESC">{t`Most recently written`}</MenuItem>
      <MenuItem value="createdAt_ASC">{t`Least recently written`}</MenuItem>
    </TextField>
  );
}

function ReplyListPage() {
  const { query } = useRouter();

  const listQueryVars = {
    filter: urlQuery2Filter(query),
    orderBy: urlQuery2OrderBy(query),
  };

  const { loading, data: listRepliesData } = useQuery(LIST_REPLIES, {
    variables: {
      ...listQueryVars,
      before: query.before,
      after: query.after,
    },
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.

  const { loading: statsLoading, data: listStatData } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  const currentUser = useCurrentUser();

  const replyEdges = listRepliesData?.ListReplies?.edges || [];
  const statsData = listStatData?.ListReplies || {};

  return (
    <AppLayout>
      <Head>
        <title>{t`Reply list`}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item>
          <ReplyFilter
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
      {currentUser && (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!query.mine}
              onChange={e =>
                goToUrlQueryAndResetPagination({
                  ...query,
                  mine: e.target.checked ? 1 : undefined,
                })
              }
            />
          }
          label={t`Only show replies written by me`}
        />
      )}
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
              msgid`${statsData.totalCount} reply`,
              `${statsData.totalCount} replies`,
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
            edges={replyEdges}
          />
          <ul className="reply-list">
            {replyEdges.map(({ node }) => (
              <ReplyItem key={node.id} reply={node} showUser={!query.mine} />
            ))}
          </ul>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={replyEdges}
          />
        </>
      )}

      <style jsx>
        {`
          .reply-list {
            padding: 0;
            list-style: none;
          }
        `}
      </style>
    </AppLayout>
  );
}

export default withData(ReplyListPage);
