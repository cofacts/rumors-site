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
        }
      }
    ], [
      'ttag', {resolve: {translations: `i18n/${process.env.PUBLIC_LOCALE}.po`}}
    ]
  ]
}