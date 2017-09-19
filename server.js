// https://github.com/zeit/next.js/blob/master/examples/custom-server-koa/server.js
//

const Koa = require('koa');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = new Koa();

  // Server-side routing
  //

  /* Required for hot-reload to work. */
  server.use(async (ctx, next) => {
    ctx.respond = false;
    ctx.res.statusCode = 200;
    handler(ctx.req, ctx.res);
    await next();
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) throw err;
      console.log('Listening port', port); // eslint-disable-line
  });
});
