import { gql, useQuery } from '@apollo/client';
import { t } from 'ttag';
import { useRouter } from 'next/router';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import ReplySearchItem from 'components/ListPageDisplays/ReplySearchItem';
import Filters from 'components/ListPageControls/Filters';
import ReplyTypeFilter from 'components/ListPageControls/ReplyTypeFilter';
import TimeRange from 'components/ListPageControls/TimeRange';
import LoadMore from 'components/ListPageControls/LoadMore';

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
    margin: '12px 0',
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
    fontSize: theme.typography.htmlFontSize,
    minWidth: 120,
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
function urlQuery2Filter({ q, start, end, types } = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = {
      like: q.slice(0, MAX_KEYWORD_LENGTH),
      minimumShouldMatch: '0',
    };
  }

  if (types) {
    filterObj.types = types.split(',');
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

function ReplySearchPageLayout() {
  const classes = useStyles();
  const { query } = useRouter();
  const listQueryVars = { filter: urlQuery2Filter(query) };

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
  const { data: listStatData } = useQuery(LIST_STAT, {
    variables: listQueryVars,
  });

  // List data
  const replyEdges = listRepliesData?.ListReplies?.edges || [];
  const statsData = listStatData?.ListReplies || {};

  return (
    <Box pt={2}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <TimeRange />
      </Box>

      <Filters className={classes.filters}>
        <ReplyTypeFilter />
      </Filters>

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
      )}
    </Box>
  );
}

export default ReplySearchPageLayout;
