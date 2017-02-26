import { createDuck } from 'redux-duck'
import { fromJS, List } from 'immutable'
import gql from '../util/GraphQL'

const articleList = createDuck('articleList');

// Action Types
//

const LOAD = articleList.defineType('LOAD');

// Action creators
//

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
      pageInfo {
        firstCursor
        lastCursor
      }
    }
  }`({
    filter,
    orderBy: [{[orderBy]: 'DESC'}],
    before,
    after,
  }).then((resp) => {
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
});

export default articleList.createReducer({
  [LOAD]: (state, {payload}) => state
    .set('edges', payload.get('edges'))
    .set('firstCursor', payload.getIn(['pageInfo', 'firstCursor']))
    .set('lastCursor', payload.getIn(['pageInfo', 'lastCursor'])),
}, initialState)
