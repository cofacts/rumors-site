/*global ga*/

import { createDuck } from 'redux-duck';
import { fromJS } from 'immutable';
import fetchAPI from '../util/fetchAPI';
import gql from '../util/gql';
import { commonSetState } from '../util/reducer';

const { defineType, createAction, createReducer } = createDuck('auth');

// Action Types
//
const LOAD = defineType('LOAD');
const RESET = defineType('RESET');
const SET_STATE = defineType('SET_STATE');
const UPDATE_USER = defineType('UPDATE_USER');

// Hacks (?)
//
let resolveAuth;
export const waitForAuth = new Promise(resolve => {
  resolveAuth = resolve;
});

// Action creators
//

export const setState = createAction(SET_STATE);

export const showDialog = () => setState({ key: 'isDialogShown', value: true });
export const hideDialog = () =>
  setState({ key: 'isDialogShown', value: false });

const levelFields = `
  level
  points {
    total
    currentLevel
    nextLevel
  }
  repliedArticleCount
`;

export const load = () => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));

  return gql`
    {
      GetUser {
        id
        name
        avatarUrl
        ${levelFields}
      }
    }
  `().then(resp => {
    const user = resp.getIn(['data', 'GetUser']);
    dispatch(setState({ key: 'isLoading', value: false }));
    dispatch(createAction(LOAD)(user));
    if (user) {
      ga('set', 'userId', user.get('id'));
    }
    resolveAuth();
  });
};
export const logout = () => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));

  return fetchAPI('/logout')
    .then(resp => resp.json())
    .then(({ success }) => {
      dispatch(setState({ key: 'isLoading', value: false }));
      if (success) {
        dispatch(createAction(RESET)());
      }
    });
};

/**
 * Updates editor's nickname
 *
 * @param {string} newName the new user name
 */
export const updateName = newName => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));

  gql`
    mutation($name: String!) {
      UpdateUser(name: $name) {
        name
      }
    }
  `({
    name: newName,
  }).then(resp => {
    dispatch(setState({ key: 'isLoading', value: false }));
    dispatch(createAction(UPDATE_USER)(resp.getIn(['data', 'UpdateUser'])));
  });
};

/**
 * Update level & point data
 */
export const loadLevel = () => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));

  return gql`
    {
      GetUser {
        ${levelFields}
      }
    }
  `().then(resp => {
    dispatch(setState({ key: 'isLoading', value: false }));
    dispatch(createAction(UPDATE_USER)(resp.getIn(['data', 'GetUser'])));
  });
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

const reducer = createReducer(
  {
    [SET_STATE]: commonSetState,
    [LOAD]: (state, { payload }) => state.set('user', payload),
    [UPDATE_USER]: (state, { payload }) => state.mergeIn(['user'], payload),
    [RESET]: state => state.set('user', initialState.get('user')),
  },
  initialState
);

export default reducer;
