module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: ['react', 'prettier'],
  rules: {
    'react/prop-types': 'off', // we don't use propTypes.
    'react/react-in-jsx-scope': 'off', // React import not needed in Next.js
    'react-hooks/exhaustive-deps': 'error', // Require explicit ignore when we want to skip deps
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }], // no console.log, but can use .warn and .error.
  },
  env: {
    browser: true,
    mocha: false,
    es6: true,
    jest: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        // For JS files to include TS files also
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: { version: 'detect' },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
    },
  ],
};
