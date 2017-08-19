import { createDuck } from 'redux-duck';
import { fromJS, List } from 'immutable';
import gql from '../util/gql';

const COSTY_FIELD_COOLDOWN = 60 * 1000; // in seconds. query costy fields only 1 time within 60 seconds

const { defineType, createReducer, createAction } = createDuck('replyList');

// Action Types
//

const LOAD = defineType('LOAD');

// Action creators
//

let isInCooldown = false;
let lastStringifiedFilter;
export const load = ({
  q,
  filter = 'all',
  orderBy = 'createdAt_DESC',
  mine,
  before,
  after,
}) => dispatch => {
  filter = getFilterObject(filter, q, mine);
  const stringifiedFilter = JSON.stringify(filter);

  if (lastStringifiedFilter !== stringifiedFilter) {
    // Invalidate costy field cache when filter changes
    isInCooldown = false;
  }

  lastStringifiedFilter = stringifiedFilter;

  // If there is query text, sort by _score first

  const [orderByField, orderByDirection] = orderBy.split('_');

  const orderByArray = q
    ? [{ _score: 'DESC' }, { [orderByField]: orderByDirection }]
    : [{ [orderByField]: orderByDirection }];

  return gql`query(
    $filter: ListReplyFilter,
    $orderBy: [ListReplyOrderBy],
    $before: String,
    $after: String,
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
          id
          versions(limit: 1) {
            user { name }
            reference
            text
            type
            createdAt
          }
          replyConnections { id }
        }
        cursor
      }

      ${isInCooldown
        ? ''
        : /* costy fields */ `
          pageInfo {
            firstCursor
            lastCursor
          }
          totalCount
        `}
    }
  }`({
    filter,
    orderBy: orderByArray,
    before,
    after,
  }).then(resp => {
    // only ignore costy fields on browser.
    //
    if (typeof window !== 'undefined' && !isInCooldown) {
      isInCooldown = true;
      setTimeout(resetCooldown, COSTY_FIELD_COOLDOWN);
    }
    dispatch(createAction(LOAD)(resp.getIn(['data', 'ListReplies'], List())));
  });
};

// Reducer
//

const initialState = fromJS({
  state: { isLoading: false },
  edges: null,
  firstCursor: null,
  lastCursor: null,
  totalCount: null,
});

export default createReducer(
  {
    [LOAD]: (state, { payload }) =>
      state
        .set(
          'edges',
          (payload.get('edges') || List())
            .map(edge => edge.setIn(['node', 'replyConnectionCount']))
        )
        .set(
          'firstCursor',
          payload.getIn(['pageInfo', 'firstCursor']) || state.get('firstCursor')
        )
        .set(
          'lastCursor',
          payload.getIn(['pageInfo', 'lastCursor']) || state.get('lastCursor')
        )
        .set(
          'totalCount',
          payload.get('totalCount') || state.get('totalCount')
        ),
  },
  initialState
);

// Util
//

function resetCooldown() {
  isInCooldown = false;
}

function getFilterObject(filter, q, mine) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  if (filter !== 'all') {
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
