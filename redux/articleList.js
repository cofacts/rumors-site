import { createDuck } from 'redux-duck'
import { fromJS, List, Map } from 'immutable'
import gql from '../util/gql'

const COSTY_FIELD_COOLDOWN = 60*1000; // in seconds. query costy fields only 1 time within 60 seconds

const {defineType, createReducer, createAction} = createDuck('articleList');

// Action Types
//

const LOAD = defineType('LOAD');
const LOAD_AUTH_FIELDS = defineType('LOAD_AUTH_FIELDS');

// Action creators
//

let isInCooldown = false;
let lastFilter;
export const load = ({
  filter = 'all',
  orderBy = 'replyRequestCount',
  before, after,
}) => dispatch => {
  if(lastFilter !== filter) {
    // Invalidate costy field cache when filter changes
    isInCooldown = false;
  }

  lastFilter = filter;

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
          references {
            createdAt
            type
          }
        }
        cursor
      }

      ${
        isInCooldown ? '' : /* costy fields */ `
          pageInfo {
            firstCursor
            lastCursor
          }
          totalCount
        `
      }
    }
  }`({
    filter: getFilterObject(filter),
    orderBy: [{[orderBy]: 'DESC'}],
    before,
    after,
  }).then((resp) => {
    // only ignore costy fields on browser.
    //
    if(typeof window !== 'undefined' && !isInCooldown) {
      isInCooldown = true;
      setTimeout(resetCooldown, COSTY_FIELD_COOLDOWN);
    }
    dispatch(createAction(LOAD)(
      resp.getIn(['data', 'ListArticles'], List())
    ));
  });
}

export const loadAuthFields = ({
  filter = 'all',
  orderBy = 'replyRequestCount',
  before, after,
}) => dispatch => {
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
          requestedForReply
        }
      }
    }
  }`({
    filter: getFilterObject(filter),
    orderBy: [{[orderBy]: 'DESC'}],
    before,
    after,
  }).then((resp) => {
    dispatch(createAction(LOAD_AUTH_FIELDS)(
      resp.getIn(['data', 'ListArticles', 'edges'], List())
    ));
  });
}

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  edges: null,
  firstCursor: null,
  lastCursor: null,
  totalCount: null,
  authFields: {},
});

export default createReducer({
  [LOAD]: (state, {payload}) => state
    .set('edges', payload.get('edges'))
    .set('firstCursor', payload.getIn(['pageInfo', 'firstCursor']) || state.get('firstCursor'))
    .set('lastCursor', payload.getIn(['pageInfo', 'lastCursor']) || state.get('lastCursor'))
    .set('totalCount', payload.get('totalCount') || state.get('totalCount')),
  [LOAD_AUTH_FIELDS]: (state, {payload}) => state
    .set('authFields', Map(payload.map(article => [article.getIn(['node', 'id']), article.get('node')])))
}, initialState);


// Util
//

function resetCooldown() {
  isInCooldown = false;
}

function getFilterObject(filter) {
  if(filter === 'solved') {
    return {replyCount: {GT: 0}};
  } else if(filter === 'unsolved') {
    return {replyCount: {EQ: 0}};
  } else {
    return undefined;
  }
}
