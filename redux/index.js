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

// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/store.js
//
let store = null;

export default function configure(initialState) {
  // Server side, always return a new store
  //
  if (typeof window === 'undefined') {
    return createStore(reducers, initialState, enhancer);
  }

  if (store) return store;

  store = createStore(reducers, initialState, enhancer);

  if (typeof module !== 'undefined' && module.hot) {
    module.hot.accept('./', () => {
      const nextReducer = require('./').default;

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
