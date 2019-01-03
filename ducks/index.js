import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import thunk from 'redux-thunk';

import articleList from './articleList';
import replyList from './replyList';
import articleDetail from './articleDetail';
import replyDetail from './replyDetail';
import auth from './auth';

const reducers = combineReducers({
  articleList,
  replyList,
  articleDetail,
  replyDetail,
  auth,
});

const enhancer = composeWithDevTools(applyMiddleware(thunk));

export default function makeStore(initialState) {
  return createStore(reducers, initialState, enhancer);
}
