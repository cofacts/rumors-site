import { createDuck } from 'redux-duck'
import { fromJS } from 'immutable'
import gql from '../util/GraphQL'

const articleDetail = createDuck('articleDetail');

// Action Types
//

const LOAD = articleDetail.defineType('LOAD');
const RESET = articleDetail.defineType('RESET');

// Action creators
//

export const load = (id) => dispatch =>
  gql`query($id: String!) {
    GetArticle(id: $id) {
      id
      text
    }
  }`({
    id
  }).then(resp => {
    dispatch(articleDetail.createAction(LOAD)(resp.getIn(['data', 'GetArticle'])));
  });

export const reset = () => articleDetail.createAction(RESET);

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  data: null,
});

export default articleDetail.createReducer({
  [LOAD]: (state, {payload}) => state.set('data', payload),
  [RESET]: (state) => state.set('data', initialState.get('data')),
}, initialState);
