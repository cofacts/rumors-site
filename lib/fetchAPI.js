import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

export const headers = {
  'x-app-id': process.env.APP_ID,
};

export default function (endpoint = '/', args = {}) {
  return fetch(`${PUBLIC_API_URL}${endpoint}`, {
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
