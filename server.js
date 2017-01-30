// https://github.com/zeit/next.js/blob/master/examples/custom-server-koa/server.js
//

import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';

const app = next({dev: process.env.NODE_ENV !== 'production'});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.get('/article/:id', (ctx) => {
    app.render(ctx.req, ctx.res, '/article', ctx.query)
    ctx.respond = false;
  });

  router.get('*', (ctx) => {
    handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  /* Required for hot-reload to work. */
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  })

  server.use(router.routes());
  server.use(router.allowedMethods());

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log('Listening port', port);
  })
})
