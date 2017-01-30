import fetch from 'isomorphic-fetch';
import {API_URL} from '../config';
import { fromJS } from 'immutable';

// Given a graphql query in string or {query, variables},
// returns a promise that resolves to immutable Map({data, errors}).
//
// http://dev.apollodata.com/tools/graphql-server/requests.html
//
export default function GraphQL(queryAndVariable) {
  if(typeof queryAndVariable !== 'object') {
    queryAndVariable = {
      query: queryAndVariable,
    }
  }

  let status;

  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
