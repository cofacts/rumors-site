// https://github.com/zeit/next.js/blob/master/examples/custom-server-koa/server.js
//

const Koa = require('koa');
const next = require('next');
const Rollbar = require('rollbar');
const send = require('koa-send');
const getConfig = require('next/config');

const { serverRuntimeConfig } = getConfig();

// Server related config & credentials
//
const serverConfig = {
  ROLLBAR_SERVER_TOKEN: serverRuntimeConfig.SERVER_ROLLBAR_SERVER_TOKEN,
  ROLLBAR_ENV: serverRuntimeConfig.SERVER_ROLLBAR_ENV || 'localhost',
  PORT: serverRuntimeConfig.SERVER_PORT || 3000,
};

const enableRollbar = !!serverConfig.ROLLBAR_SERVER_TOKEN;
const rollbar = new Rollbar({
  enabled: enableRollbar,
  captureUncaught: enableRollbar,
  captureUnhandledRejections: enableRollbar,
  accessToken: serverConfig.ROLLBAR_SERVER_TOKEN,
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

  //
  server.use(async (ctx, next) => {
    switch (ctx.path) {
      case '/': {
        const lang = ctx.acceptsLanguages(['zh', 'en']) || 'en';
        await send(ctx, `./static/index-${lang}.html`);
        break;
      }
      case '/en':
        await send(ctx, './static/index-en.html');
        break;
      case '/tw':
        await send(ctx, './static/index-zh.html');
        break;
      case '/workshop':
        ctx.redirect(
          'https://via.hypothes.is/https://g0v.hackmd.io/s/r1NGjuG5m'
        );
        break;
      case '/analytics':
        ctx.redirect(
          'https://datastudio.google.com/open/18J8jZYumsoaCPBk9bdRd97GKvi_W5v-r'
        );
        break;
      case '/hack':
        ctx.redirect('https://beta.hackfoldr.org/cofacts');
        break;
      default:
        await next();
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
