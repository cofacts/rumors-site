import { createDuck } from 'redux-duck'
import { fromJS, List } from 'immutable'
import gql from '../util/GraphQL'

const articleList = createDuck('articleList');

// Action Types
//

const LOAD = articleList.defineType('LOAD');

// Action creators
//

export const load = () => dispatch =>
  gql`{
    ListArticles {
      edges {
        node {
          id
          text
        }
      }
    }
  }`().then((resp) => {
    dispatch(articleList.createAction(LOAD)(resp.getIn(['data', 'ListArticles', 'edges'], List()).map(edge => edge.get('node'))));
  })

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  data: null,
});

export default articleList.createReducer({
  [LOAD]: (state, {payload}) => state.set('data', payload),
}, initialState)
