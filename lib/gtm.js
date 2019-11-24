/**
 * Google tag manager related utility functions
 */

/**
 * @param  {...any} args - data to feed to dataLayer.push
 */
export function pushToDataLayer(...args) {
  if (typeof window === 'undefined') return; // Skip in SSR

  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push(...args);
}
