import { withData } from 'next-apollo';
import { HttpLink } from 'apollo-boost';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const config = {
  link: new HttpLink({
    uri: `${publicRuntimeConfig.PUBLIC_API_URL}/graphql`, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  }),
};

export default withData(config);
