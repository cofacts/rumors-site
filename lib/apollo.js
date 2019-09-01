import { withData } from 'next-apollo';
import { HttpLink } from 'apollo-boost';

const config = {
  link: new HttpLink({
    uri: `${process.env.API_URL}/graphql`, // Server URL (must be absolute)
    credentials: 'include', // Additional fetch() options like `credentials` or `headers`
  }),
};

export default withData(config);
