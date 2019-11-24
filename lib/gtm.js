import { useEffect } from 'react';

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

/**
 * @param {object} props - data to send to pushDataLayer on component mount
 */
export function PushToDataLayer({ ...props }) {
  useEffect(() => {
    // Make sure all rendered elements has been flushed to DOM
    setTimeout(() => {
      pushToDataLayer(props);
    }, 0);
  }, []);

  return null;
}
