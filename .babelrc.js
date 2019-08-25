require('dotenv').config();

module.exports = {
  "presets": ["next/babel"],
  "plugins": [[
    'ttag', {resolve: {translations: `i18n/${process.env.PUBLIC_LOCALE}.po`}}
  ]]
}