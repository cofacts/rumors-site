require('dotenv').config();

module.exports = {
  "presets": ["next/babel"],
  "plugins": [
    [
      "module-resolver",
      // https://github.com/tleunen/babel-plugin-module-resolver#getting-started
      {
        "root": ["./"],
        "alias": {
          "components": "./components",
          "constants": "./constants",
          "pages": "./pages",
          "lib": "./lib",
        }
      }
    ], [
      'ttag', {resolve: {translations: `i18n/${process.env.LOCALE}.po`}}
    ],
    "@babel/plugin-proposal-class-properties", // ttag extraction needs it, even though it's included in next/babel...
    "@babel/plugin-proposal-optional-chaining",
  ]
}