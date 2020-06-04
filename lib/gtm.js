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
 * @param {*} trigger - trigger useEffect() after trigger turns truthy
 * @param {object} args - data to send to pushDataLayer on trigger change
 */
export function usePushToDataLayer(trigger, args) {
  const dontTrigger = !trigger;
  useEffect(() => {
    if (dontTrigger) return;
    pushToDataLayer(args);
  }, [dontTrigger, args]);
}
