import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // schema: 'http://localhost:5000/graphql',
  schema: 'https://dev-api.cofacts.tw/graphql',
  documents: ['pages/**/*.tsx?', 'components/**/*.tsx?', 'lib/**/*.tsx'],
  generates: {
    './typegen/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        // Rename useFragment to avoid conflicting with ESLint React hook rule
        // https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#embrace-fragment-masking-principles
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
  },
};
export default config;
