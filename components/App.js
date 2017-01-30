// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//

import React from 'react';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configure from '../redux';


// Wraps the app with <Provider />, and invoke
/// initFn(dispatch, context passed in getInitialProps)
// when getInitialProps() is invoked.
//
export default (initFn) => (Component) => {
  return class App extends React.Component {
    static async getInitialProps(ctx) {
      const store = configure();
      await initFn(store.dispatch, ctx);

      return {
        // passed to browser by next.js's mechanism
        //
        initialState: store.getState(),

        // Other stuff inside getInitialProps' context
        //
        pathname: ctx.pathname, query: ctx.query, err: ctx.error,
      };
    }

    constructor(props) {
      super(props);

      this.store = configure(
        // Convert back the rehydrated state to ImmutableJS objects.
        //
        Object.keys(props.initialState).reduce((obj, key) => ({
          ...obj,
          [key]: fromJS(props.initialState[key]),
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
