module.exports = {
  API_URL: process.env.USE_LOCAL ? 'http://localhost:5000' : 'http://api.rumors.hacktabl.org',
  APP_ID: process.env.USE_LOCAL ? 'RUMORS_SITE' : 'DEV',
};
