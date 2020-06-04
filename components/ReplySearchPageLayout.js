import { useState } from 'react';
import gql from 'graphql-tag';
import { t } from 'ttag';
import Router, { useRouter } from 'next/router';
import url from 'url';
import { useQuery } from '@apollo/react-hooks';

import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TYPE_NAME } from 'constants/replyType';

import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';

import ReplySearchItem from 'components/ReplySearchItem';
import Filters, { Filter } from 'components/Filters';
import TimeRange from 'components/TimeRange';

const MAX_KEYWORD_LENGTH = 100;

const LIST_REPLIES = gql`
  query ListReplies($filter: ListReplyFilter, $after: String) {
    ListReplies(filter: $filter, after: $after, first: 10) {
      edges {
        node {
          ...ReplySearchItem
        }
        cursor
      }
    }
  }
  ${ReplySearchItem.fragments.ReplySearchItem}
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

const useStyles = makeStyles(theme => ({
  filters: {
    padding: '12px 0',
  },
  openFilter: {
    position: 'fixed',
    left: 22,
    bottom: 22,
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  filtersModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  closeIcon: {
    position: 'absolute',
    right: 12,
    top: 20,
    color: theme.palette.secondary[100],
  },
  loadMore: {
    width: '33%',
    color: theme.palette.secondary[300],
    outline: 'none',
    cursor: 'pointer',
    borderRadius: 30,
    padding: 10,
    background: 'transparent',
    border: `1px solid ${theme.palette.secondary[300]}`,
  },
  loading: {
    color: theme.palette.secondary[300],
  },
}));

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListReplyFilter
 */
function urlQuery2Filter({ q, start, end, types = '' } = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = {
      like: q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '0',
    };
  }

  const selectedTypes = types.split(',');

  if (selectedTypes[0]) {
    // @todo: fix the logic when multi-types filter finishes
    //filterObj.types = selectedTypes;
    filterObj.type = selectedTypes[0];
  }

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
 * @param {object} urlQuery
 */
function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.after;
  urlQuery = Object.fromEntries(
    Object.entries(urlQuery).filter(entry => !!entry[1])
  );
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

function ReplySearchPageLayout() {
  const classes = useStyles();
  const [showFilter, setFilterShow] = useState(false);

  const { query } = useRouter();
  const listQueryVars = { filter: urlQuery2Filter(query) };

  const {
    loading,
    fetchMore,
    data: listRepliesData,
    error: listRepliesError,
  } = useQuery(LIST_REPLIES, {
    variables: listQueryVars,
  });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  const { data: listStatData } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  // List data
  const replyEdges = listRepliesData?.ListReplies?.edges || [];
  const statsData = listStatData?.ListReplies || {};

  const lastCursorOfPage =
    replyEdges.length &&
    replyEdges[replyEdges.length - 1] &&
    replyEdges[replyEdges.length - 1].cursor;
  const { lastCursor } = statsData?.pageInfo || {};

  const selectedTypes = query.types ? query.types.split(',') : [];

  const filterElem = (
    <Filters className={classes.filters} data-ga="Mobile filter view">
      <Filter
        title={t`Consider`}
        multiple
        options={Object.entries(TYPE_NAME).map(([value, label]) => ({
          value,
          label,
          selected: selectedTypes.includes(value),
        }))}
        onChange={selected =>
          goToUrlQueryAndResetPagination({
            ...query,
            types: selected.join(','),
          })
        }
      />
    </Filters>
  );

  return (
    <Box pt={2}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <TimeRange
          range={listQueryVars?.filter?.createdAt}
          onChange={time =>
            goToUrlQueryAndResetPagination({
              ...query,
              start: time?.GTE,
              end: time?.LTE,
            })
          }
        />
      </Box>

      <Box display={['none', 'none', 'block']}>{filterElem}</Box>

      {loading && !replyEdges.length ? (
        t`Loading...`
      ) : listRepliesError ? (
        listRepliesError.toString()
      ) : (
        <>
          <Box component="ul" p={0}>
            {replyEdges.map(({ node }) => (
              <ReplySearchItem key={node.id} {...node} query={query.q} />
            ))}
          </Box>
          {lastCursorOfPage !== lastCursor && (
            <Box display="flex" pb={1.5} justifyContent="center">
              <button
                data-ga="LoadMore"
                type="button"
                className={classes.loadMore}
                onClick={() =>
                  fetchMore({
                    variables: {
                      after: lastCursorOfPage,
                    },
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
              >
                {loading ? (
                  <CircularProgress
                    size={16}
                    classes={{ root: classes.loading }}
                  />
                ) : (
                  t`Load More`
                )}
              </button>
            </Box>
          )}
        </>
      )}
      <Fab
        variant="extended"
        aria-label="filters"
        data-ga="Mobile filter button"
        className={classes.openFilter}
        onClick={() => setFilterShow(!showFilter)}
      >
        <FilterListIcon />
        {t`Filter`}
      </Fab>
      <Modal
        aria-labelledby="filters"
        aria-describedby="filters"
        open={showFilter}
        onClose={() => setFilterShow(false)}
        closeAfterTransition
        className={classes.filtersModal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showFilter}>
          <Box position="relative">
            {filterElem}
            <CloseIcon
              className={classes.closeIcon}
              onClick={() => setFilterShow(false)}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default ReplySearchPageLayout;
