import { createDuck } from 'redux-duck';
import { fromJS } from 'immutable';
import fetchAPI from '../util/fetchAPI';
import gql from '../util/gql';
import { API_URL } from '../config';

const {defineType, createAction, createReducer} = createDuck('auth');

// Action Types
//
const LOAD = defineType('LOAD');
const RESET = defineType('RESET');
const SET_STATE = defineType('SET_STATE');

// Action creators
//

export const setState = createAction(SET_STATE);

export const showDialog = () => setState({key: 'isDialogShown', value: true});
export const hideDialog = () => setState({key: 'isDialogShown', value: false});

export const load = () => dispatch => {
  dispatch(setState({key: 'isLoading', value: true}));

  return gql`{
    GetUser { id, name, avatarUrl }
  }`().then(resp => {
    dispatch(setState({key: 'isLoading', value: false}));
    dispatch(createAction(LOAD)(resp.getIn(['data', 'GetUser'])));
  });
};
export const logout = () => dispatch => {
  dispatch(setState({key: 'isLoading', value: true}));

  return fetchAPI('/logout').then(resp => resp.json()).then(({success}) => {
    dispatch(setState({key: 'isLoading', value: false}));
    if(success) {
      dispatch(createAction(RESET)());
    }
  })
};

// Reducer
//
const initialState = fromJS({
  state: {
    isLoading: false,
    isDialogShown: false,
  },
  user: null,
});

const reducer = createReducer({
  [SET_STATE]: (state, {payload: {key, value}}) => state.setIn(['state', key], value),
  [LOAD]: (state, {payload}) => state.set('user', payload),
  [RESET]: (state) => state.set('user', initialState.get('user')),
}, initialState);

export default reducer;