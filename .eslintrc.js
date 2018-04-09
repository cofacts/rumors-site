module.exports = {
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  plugins: [
    "react",
    "prettier",
  ],
  rules: {
    'react/prop-types': 'off', // we don't use propTypes.
    'prettier/prettier': ["error", {
      "trailingComma": "es5",
      "singleQuote": true,
    }],
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
      'babel-module': {}
    }
  }
};
