import fetch from 'isomorphic-fetch';
const { API_URL, APP_ID } = require('../config');

export default function(endpoint = '/', args = {}) {
  return fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': APP_ID,
      ...args.headers,
    },
    credentials: 'include',
    ...args,
  });
}
