import { useEffect, useRef } from 'react';

/**
 * Google tag manager related utility functions
 */

/**
 * @param args - data to feed to dataLayer.push
 */
export function pushToDataLayer(...args: unknown[]) {
  if (typeof window === 'undefined') return; // Skip in SSR

  if (!('dataLayer' in window)) window['dataLayer'] = [];
  window['dataLayer'].push(...args);
}

/**
 * @param trigger - trigger useEffect() after trigger turns truthy
 * @param args - data to send to pushDataLayer on trigger change. It's sent only once.
 *               Changes to args afterwards does not trigger push anymore.
 */
export function usePushToDataLayerOnce(trigger: unknown, args: object) {
  const triggeredRef = useRef(false);
  const dontTrigger = !trigger;
  useEffect(() => {
    if (dontTrigger || triggeredRef.current) return;
    triggeredRef.current = true;
    pushToDataLayer(args);
  }, [dontTrigger, args]);
}
