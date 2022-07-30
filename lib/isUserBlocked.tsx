/**
 * Utility for user blocking mechanism.
 * See: https://g0v.hackmd.io/rf0A7MRfTOC613QZmFehQA#User-Blocking
 */

import React, { useContext } from 'react';
import Cookies from 'js-cookie';

const COOKIE_KEY = 'isUserBlocked';
const COOKIE_TRUE_VALUE = '1';
const isUserBlockedContext = React.createContext(false);

type Props = {
  serverSideCookie?: object;
  children: React.ReactNode;
}

/**
 * The context provider for decendents to read if the current browser belongs to a blocked user.
 * It reads from an independent cookie so that it remains true even after the blocked user is logged
 * out.
 *
 * @param {Object} props
 * @param {Object?} props.serverSideCookie - the cookie from server side, set by _document.js
 * @returns {React.Provider<boolean>}
 */
export function IsUserBlockedProvider({ serverSideCookie, children }: Props): React.ReactElement {
  const { Provider } = isUserBlockedContext;
  const cookieValue = serverSideCookie
    ? serverSideCookie[COOKIE_KEY]
    : Cookies.get(COOKIE_KEY);

  return (
    <Provider value={cookieValue === COOKIE_TRUE_VALUE}>{children}</Provider>
  );
}

/**
 * Reads from IsUserBlockedProvider
 * @returns {boolean}
 */
export function useIsUserBlocked() {
  return useContext(isUserBlockedContext);
}

/**
 * Set cookie when we know this browser is blocked, if not set previously.
 *
 * After we set cookie, reload the page to update the server-rendered UI.
 */
export function blockUserBrowserAndRefreshIfNeeded() {
  // No-op if cookie is already set
  if (Cookies.get(COOKIE_KEY) === COOKIE_TRUE_VALUE) return;

  Cookies.set(COOKIE_KEY, COOKIE_TRUE_VALUE);
  location.reload();
}
