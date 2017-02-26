import { createDuck } from 'redux-duck'
import { fromJS, List } from 'immutable'
import gql from '../util/GraphQL'

const COSTY_FIELD_COOLDOWN = 60*1000; // in seconds. query costy fields only 1 time within 60 seconds

const articleList = createDuck('articleList');

// Action Types
//

const LOAD = articleList.defineType('LOAD');

// Action creators
//

let isInCooldown = false;
export const load = ({
  filter = 'unsolved',
  orderBy = 'replyRequestCount',
  before, after,
}) => dispatch => {
  if(filter === 'solved') {
    filter = {replyCount: {GT: 0}};
  } else {
    filter = {replyCount: {EQ: 0}};
  }

  // Don't query costyFields
  const costyFields = isInCooldown ? '' : `
    pageInfo {
      firstCursor
      lastCursor
    }
    totalCount
  `;

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
    ) {
      edges {
        node {
          id
          text
        }
        cursor
      }

      ${costyFields}
    }
  }`({
    filter,
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
    dispatch(articleList.createAction(LOAD)(
      resp
        .getIn(['data', 'ListArticles'], List())
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
});

export default articleList.createReducer({
  [LOAD]: (state, {payload}) => state
    .set('edges', payload.get('edges'))
    .set('firstCursor', payload.getIn(['pageInfo', 'firstCursor']) || state.get('firstCursor'))
    .set('lastCursor', payload.getIn(['pageInfo', 'lastCursor']) || state.get('lastCursor'))
    .set('totalCount', payload.get('totalCount') || state.get('totalCount')),
}, initialState);


// Util
//

function resetCooldown() {
  isInCooldown = false;
}
