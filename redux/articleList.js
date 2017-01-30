import { createDuck } from 'redux-duck'
import { fromJS } from 'immutable'
import GraphQL from '../util/GraphQL'

const articleList = createDuck('articleList');

// Action Types
//

const LOAD = articleList.defineType('LOAD');

// Action creators
//

export const load = () => dispatch =>
  GraphQL(` {
    ListArticles {
      id
      text
    }
  }`).then(resp => {
    dispatch(articleList.createAction(LOAD)(resp.data.ListArticles));
  })

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  data: null,
});

export default articleList.createReducer({
  [LOAD]: (state, {data}) => state.set('data', data),
}, initialState)
