/**
 * Utility functions for conversions between list page URL params and GraphQL arguments.
 * Useful for list page components and RSS endpoints.
 */

import Router from 'next/router';
import url from 'url';

/**
 * @param {object} urlQuery
 */
export function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.after;
  urlQuery = Object.fromEntries(
    Object.entries(urlQuery).filter(entry => entry[1] !== undefined)
  );
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}
