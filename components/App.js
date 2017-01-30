// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//

import React from 'react';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configure from '../redux';

export default (initFn) => (Component) => {
  return class App extends React.Component {
    static async getInitialProps(...args) {
      const store = configure();
      await initFn(store.dispatch, ...args);
      return { initialState: store.getState() };
    }

    constructor(props) {
      super(props);

      this.store = configure(
        Object.keys(props.initialState).reduce((obj, key) => ({
          ...obj,
          [key]: fromJS(obj),
        }), {})
      );
    }

    render() {
      return (
        <Provider store={this.store}>
          <Component {...this.props} />
        </Provider>
      )
    }
  }

}
