// https://github.com/zeit/next.js/blob/master/examples/custom-server-koa/server.js
//

const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

// viewPath: mapped client-side route
//
const render = viewPath => ctx => {
  app.render(ctx.req, ctx.res, viewPath, { ...ctx.query, ...ctx.params });
  ctx.respond = false;
};

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  // Server-side routing
  //

  router.get('/article/:id', render('/article'));

  router.get('*', ctx => {
    handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  /* Required for hot-reload to work. */
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.use(router.allowedMethods());

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log('Listening port', port); // eslint-disable-line
  });
});
