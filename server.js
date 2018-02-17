// https://github.com/zeit/next.js/blob/master/examples/custom-server-koa/server.js
//

const Koa = require('koa');
const next = require('next');
const Rollbar = require('rollbar');

// Server related config & credentials
//
const serverConfig = {
  ROLLBAR_SERVER_TOKEN: process.env.ROLLBAR_SERVER_TOKEN,
  ROLLBAR_ENV: process.env.ROLLBAR_ENV || 'localhost',
  PORT: process.env.PORT || 3000,
};

const rollbar = new Rollbar({
  accessToken: serverConfig.ROLLBAR_SERVER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: serverConfig.ROLLBAR_ENV,
});

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = new Koa();

  // Rollbar error handling
  //
  server.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  });

  // Server-side routing
  //

  /* Required for hot-reload to work. */
  server.use(async (ctx, next) => {
    ctx.respond = false;
    ctx.res.statusCode = 200;
    handler(ctx.req, ctx.res);
    await next();
  });

  server.listen(serverConfig.PORT, err => {
    if (err) throw err;
      console.log('Listening port', serverConfig.PORT); // eslint-disable-line
  });
});
