/**
 * Utility functions for conversions between list page URL params and GraphQL arguments.
 * Useful for list page components and RSS endpoints.
 */

import Router from 'next/router';
import url from 'url';

/**
 * Go to query with pagination params deleted.
 *
 * @param {{[string]: string|undefined}} urlQuery - the new query object to set to URL.
 *   Set to undefined to delete a key from URL query.
 */
export function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.after;
  urlQuery = Object.fromEntries(
    Object.entries(urlQuery).filter((entry) => entry[1] !== undefined)
  );
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}
