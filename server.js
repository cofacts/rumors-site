// Copies from production `next start` script
// https://github.com/zeit/next.js/blob/canary/packages/next/cli/next-start.ts
// https://github.com/zeit/next.js/blob/canary/packages/next/server/lib/start-server.ts
//
const { createServer } = require('http');
const next = require('next');
const { resolve } = require('path');

const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dir: resolve('.') });
const srv = createServer(app.getRequestHandler());

srv.on('listening', () => {
  app.prepare().then(() => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});

srv.on('error', (err) => {
  console.error('Startup error', err);
  process.exit(1);
});

srv.listen(port);
