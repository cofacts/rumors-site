/**
 * Server-side rollbar instance, shared across APIs and _document.js.
 *
 * Please don't import this in browser environment, or the server token will be exposed!
 */
import Rollbar from 'rollbar';
import getConfig from 'next/config';

if (typeof window !== 'undefined') {
  throw new Error(
    "Please don't import lib/rollbar in browser components, it's meant for server environment."
  );
}

const {
  publicRuntimeConfig: { PUBLIC_ROLLBAR_ENV },
  serverRuntimeConfig: { SERVER_ROLLBAR_TOKEN },
} = getConfig();

// Server-side rollbar instance
const rollbar = new Rollbar({
  enabled: !!SERVER_ROLLBAR_TOKEN,
  accessToken: SERVER_ROLLBAR_TOKEN,
  environment: PUBLIC_ROLLBAR_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  nodeSourceMaps: true,
});

export default rollbar;
