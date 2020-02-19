import Router from 'next/router';
import url from 'url';

/**
 * Navigates to same path but with different query string, with pagination param (before / after)
 * resetted.
 *
 * @param {object} urlQuery
 */
export function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.before;
  delete urlQuery.after;
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

/**
 * Ensures query string arrays are arrays.
 *
 * @param {string|string[]} stringOrArray
 * @returns {string[]}
 */
export function getArrayFromQueryParam(stringOrArray) {
  if (typeof stringOrArray === 'string') return [stringOrArray];
  return stringOrArray;
}
