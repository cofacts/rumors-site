import { createDuck } from 'redux-duck';
import { fromJS } from 'immutable';
import gql from '../util/gql';

const { defineType, createAction, createReducer } = createDuck('replyDetail');

// Action Types
//

const LOAD = defineType('LOAD');
const SET_STATE = defineType('SET_STATE');
const RESET = defineType('RESET');

// Action creators
//

const loadData = createAction(LOAD);
const setState = createAction(SET_STATE);

export const load = id => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));
  return gql`
    query($id: String!) {
      GetReply(id: $id) {
        versions(limit: 1) {
          type
          text
          createdAt
        }
        replyConnections {
          article {
            id
            text
          }
          user {
            name
          }
          createdAt
        }
      }
    }
  `({ id }).then(resp => {
    dispatch(loadData(resp.getIn(['data', 'GetReply'])));
    dispatch(setState({ key: 'isLoading', value: false }));
  });
};

export const reset = () => createAction(RESET);

// Reducer
//

const initialState = fromJS({
  state: { isLoading: false },
  data: {
    // data from server
    reply: null,
  },
});

export default createReducer(
  {
    [SET_STATE]: (state, { payload: { key, value } }) =>
      state.setIn(['state', key], value),

    [LOAD]: (state, { payload }) => {
      return state.setIn(['data', 'reply'], payload);
    },

    [RESET]: state => state.set('data', initialState.get('data')),
  },
  initialState
);
