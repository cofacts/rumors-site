import fetch from 'isomorphic-fetch';
import {API_URL} from '../config';

export default function GraphQL(queryAndVariable) {
  if(typeof queryAndVariable !== 'object' || queryAndVariable.query ) {
    queryAndVariable = {
      query: queryAndVariable,
    }
  }

  return fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(queryAndVariable),
  }).then(r => r.json());
}
