import fetch from 'isomorphic-unfetch';

export const headers = {
  'x-app-id': process.env.APP_ID,
};

export default function(endpoint = '/', args = {}) {
  return fetch(`/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...args.headers,
    },
    credentials: 'include',
    ...args,
  });
}
