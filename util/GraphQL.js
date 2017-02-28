import fetch from 'isomorphic-fetch';
import {API_URL} from '../config';
import { fromJS } from 'immutable';

// Usage:
//
// import gql from './util/GraphQL';
// gql`query($var: Type) { foo }`({var: 123}).then(...)
//
// gql`...`() returns a promise that resolves to immutable Map({data, errors}).
//
// We use template string here so that Atom's language-babel does syntax highlight
// for us.
//
// GraphQL Protocol: http://dev.apollodata.com/tools/graphql-server/requests.html
//
export default (query, ...substitutions) => (variables) => {
  const queryAndVariable = {
    query: String.raw(query, ...substitutions),
  };

  if(variables) queryAndVariable.variables = variables;

  let status;

  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'RUMORS_SITE',
    },
    credentials: 'include',
    body: JSON.stringify(queryAndVariable),
  }).then(r => {
    status = r.status;
    return r.json();
  }).then((resp) => {
    if(status === 400) {
      throw new Error(`GraphQL Error: ${resp.errors.map(({message}) => message).join('\n')}`);
    }
    if (resp.errors) {
      // When status is 200 but have error, just print them out.
      console.error('GraphQL operation contains error:', resp.errors);
    }
    return fromJS(resp);
  });
}
