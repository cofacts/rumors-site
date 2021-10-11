import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
  target: process.env.API_URL,
  secure: false,
  followRedirects: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
});

async function proxyHandler(req, res) {
  await new Promise((resolve, reject) => {
    apiProxy(req, res, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export default proxyHandler;
