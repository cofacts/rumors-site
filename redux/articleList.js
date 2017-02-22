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
}) => dispatch => {
  if(filter === 'solved') {
    filter = {replyCount: {GT: 0}};
  } else {
    filter = {replyCount: {EQ: 0}};
  }

  return gql`query($filter: ListArticleFilter, $orderBy: [ListArticleOrderBy]) {
    ListArticles(
      filter: $filter,
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          text
        }
      }
    }
  }`({
    filter,
    orderBy: [{[orderBy]: 'DESC'}],
  }).then((resp) => {
    dispatch(articleList.createAction(LOAD)(
      resp
        .getIn(['data', 'ListArticles', 'edges'], List())
        .map(edge => edge.get('node'))
    ));
  });
}

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  data: null,
});

export default articleList.createReducer({
  [LOAD]: (state, {payload}) => state.set('data', payload),
}, initialState)
