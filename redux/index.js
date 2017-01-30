import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import thunk from 'redux-thunk';

import articleList from './articleList';
import articleDetail from './articleDetail';

const reducers = combineReducers({
  articleList,
  articleDetail,
});

const enhancer = composeWithDevTools(
  applyMiddleware(thunk)
);

// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/store.js
//
let store = null;

export default function configure(initialState) {
  // Server side, always return a new store
  //
  if(typeof window === 'undefined') {
    return createStore(reducers, initialState, enhancer);
  }

  if(store) return store;

  store = createStore(reducers, initialState, enhancer);

  if (typeof module !== 'undefined' && module.hot) {
    module.hot.accept('./', () => {
      const nextReducer = require('./').default;

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
