// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//

import React from 'react';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import { setLogin } from '../util/gql';
import configure from '../redux';
import { login, load } from '../redux/auth';
import AppHeader from './AppHeader';
import LoginModal from './Modal/LoginModal';

let isBootstrapping = true;

// Wraps the app with <Provider />, and invoke
/// initFn(dispatch, context passed in getInitialProps)
// when getInitialProps() is invoked.
//
export default (initFn) => (Component) => {
  return class App extends React.Component {
    static async getInitialProps(ctx) {
      const store = configure();

      if(typeof window !== 'undefined') {
        setLogin(() => store.dispatch(login()));
      }

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

    componentDidMount() {
      // Bootstrapping: Load auth
      //
      if(isBootstrapping) {
        this.store.dispatch(load());
        isBootstrapping = false;
      }
    }

    render() {
      return (
        <Provider store={this.store}>
          <div>
            <AppHeader />
            <Component {...this.props} />
            <LoginModal />
          </div>
        </Provider>
      )
    }
  }

}
