import fetch from 'isomorphic-unfetch';

export default function(endpoint = '/', args = {}) {
  return fetch(`${process.env.API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': process.env.APP_ID,
      ...args.headers,
    },
    credentials: 'include',
    ...args,
  });
}
