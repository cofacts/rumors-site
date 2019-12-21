import stackimpact from 'stackimpact';
import getConfig from 'next/config';

const {
  serverRuntimeConfig: {
    SERVER_STACKIMPACT_AGENT_KEY,
    SERVER_STACKIMPACT_APP_NAME,
  },
} = getConfig();

const agent = SERVER_STACKIMPACT_AGENT_KEY
  ? stackimpact.start({
      agentKey: SERVER_STACKIMPACT_AGENT_KEY,
      appName: SERVER_STACKIMPACT_APP_NAME,
    })
  : {
      profile: () => ({ stop: () => {} }),
    };

export default agent;
