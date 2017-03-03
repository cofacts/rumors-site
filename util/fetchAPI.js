import fetch from 'isomorphic-fetch';
import {API_URL} from '../config';

export default function(endpoint = '/', args = {}) {
  return fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'RUMORS_SITE',
      ...args.headers,
    },
    credentials: 'include',
    ...args
  });
}