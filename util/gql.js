import fetchAPI from './fetchAPI';

import { fromJS } from 'immutable';

let login = () => {};

// Usage:
//
// import gql from './util/gql';
// gql`query($var: Type) { foo }`({var: 123}).then(...)
//
// gql`...`() returns a promise that resolves to immutable Map({data, errors}).
//
// We use template string here so that Atom's language-babel does syntax highlight
// for us.
//
// GraphQL Protocol: http://dev.apollodata.com/tools/graphql-server/requests.html
//
export default (query, ...substitutions) => variables => {
  const queryAndVariable = {
    query: String.raw(query, ...substitutions),
  };

  if (variables) queryAndVariable.variables = variables;

  let status;

  return fetchAPI('/graphql', {
    body: JSON.stringify(queryAndVariable),
  })
    .then(r => {
      status = r.status;
      return r.json();
    })
    .then(resp => {
      if (resp.errors) {
        const shouldLogin = resp.errors.some(err => err.authError);
        if (shouldLogin) {
          login();
          throw new Error('請先登入以繼續');
        }
        if (status === 400) {
          throw new Error(
            `GraphQL Error: ${resp.errors
              .map(({ message }) => message)
              .join('\n')}`
          );
        }
        // When status is 200 but have error, just print them out.
        console.error('GraphQL operation contains error:', resp.errors);
      }
      return fromJS(resp);
    });
};

// A hack to make gql`...` can invoke redux actions
//
export function setLogin(loginFn) {
  login = loginFn;
}
