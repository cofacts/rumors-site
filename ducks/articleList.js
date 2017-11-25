import { createDuck } from 'redux-duck';
import { fromJS, List, Map } from 'immutable';
import { waitForAuth } from './auth';
import gql from '../util/gql';
import { commonSetState } from '../util/reducer';

const COSTY_FIELD_COOLDOWN = 60 * 1000; // in seconds. query costy fields only 1 time within 60 seconds

const { defineType, createReducer, createAction } = createDuck('articleList');

// Action Types
//

const LOAD = defineType('LOAD');
const LOAD_AUTH_FIELDS = defineType('LOAD_AUTH_FIELDS');
const SET_STATE = defineType('SET_STATE');

// Action creators
//
export const setState = createAction(SET_STATE);

let isInCooldown = false;
let lastStringifiedFilter;
export const load = ({
  q,
  filter = 'unsolved',
  orderBy = 'createdAt',
  before,
  after,
}) => dispatch => {
  const filterObject = getFilterObject(filter, q);
  const stringifiedFilter = JSON.stringify(filterObject);

  if (lastStringifiedFilter !== stringifiedFilter) {
    // Invalidate costy field cache when filter changes
    isInCooldown = false;
  }

  lastStringifiedFilter = stringifiedFilter;

  // If there is query text, sort by _score first
  const orderByArray = q
    ? [{ _score: 'DESC' }, { [orderBy]: 'DESC' }]
    : [{ [orderBy]: 'DESC' }];

  dispatch(setState({ key: 'isLoading', value: true }));
  return gql`query(
    $filter: ListArticleFilter,
    $orderBy: [ListArticleOrderBy],
    $before: String,
    $after: String,
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

      ${
        isInCooldown
          ? ''
          : /* costy fields */ `
          pageInfo {
            firstCursor
            lastCursor
          }
          totalCount
        `
      }
    }
  }`({
    filter: filterObject,
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
    dispatch(createAction(LOAD)(resp.getIn(['data', 'ListArticles'], List())));
    dispatch(setState({ key: 'isLoading', value: false }));
  });
};

export const loadAuthFields = ({
  q,
  filter = 'all',
  orderBy = 'replyRequestCount',
  before,
  after,
}) => (dispatch, getState) => {
  waitForAuth.then(() => {
    if (!getState().auth.get('user')) return;

    return gql`
      query(
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
              requestedForReply
            }
          }
        }
      }
    `({
      filter: getFilterObject(filter, q),
      orderBy: [{ [orderBy]: 'DESC' }],
      before,
      after,
    }).then(resp => {
      dispatch(
        createAction(LOAD_AUTH_FIELDS)(
          resp.getIn(['data', 'ListArticles', 'edges'], List())
        )
      );
    });
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
  authFields: {},
});

export default createReducer(
  {
    [SET_STATE]: commonSetState,

    [LOAD]: (state, { payload }) =>
      state
        .set('edges', payload.get('edges'))
        .set(
          'firstCursor',
          payload.getIn(['pageInfo', 'firstCursor']) === undefined
            ? state.get('firstCursor')
            : payload.getIn(['pageInfo', 'firstCursor'])
        )
        .set(
          'lastCursor',
          payload.getIn(['pageInfo', 'lastCursor']) === undefined
            ? state.get('lastCursor')
            : payload.getIn(['pageInfo', 'lastCursor'])
        )
        .set(
          'totalCount',
          payload.get('totalCount') === undefined
            ? state.get('totalCount')
            : payload.get('totalCount')
        ),
    [LOAD_AUTH_FIELDS]: (state, { payload }) =>
      state.set(
        'authFields',
        Map(
          payload.map(article => [
            article.getIn(['node', 'id']),
            article.get('node'),
          ])
        )
      ),
  },
  initialState
);

// Util
//

function resetCooldown() {
  isInCooldown = false;
}

function getFilterObject(filter, q) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  if (filter === 'solved') {
    filterObj.replyCount = { GT: 0 };
  } else if (filter === 'unsolved') {
    filterObj.replyCount = { EQ: 0 };
  }

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }
  return filterObj;
}
