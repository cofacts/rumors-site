import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:5000/graphql',
  // schema: 'https://dev-api.cofacts.tw/graphql',
  documents: ['pages/**/*.tsx?', 'components/**/*.tsx?', 'lib/**/*.tsx'],
  generates: {
    './typegen/': {
      preset: 'client',
      plugins: [],
    },
  },
};
export default config;
