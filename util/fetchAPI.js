import fetch from 'isomorphic-fetch';
import getConfig from 'next/config';
const {
  publicRuntimeConfig: { PUBLIC_API_URL, PUBLIC_APP_ID },
} = getConfig();

export default function(endpoint = '/', args = {}) {
  return fetch(`${PUBLIC_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': PUBLIC_APP_ID,
      ...args.headers,
    },
    credentials: 'include',
    ...args,
  });
}
