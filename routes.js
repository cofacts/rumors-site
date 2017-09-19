const routes = (module.exports = require('next-routes')());

routes
  // routes.add(name, pattern = /name, page = name)
  .add('home', '/', 'index')
  .add('articles', '/', 'index')
  .add('replies', '/replies', 'replies')
  // routes.add({name: 'name', pattern: '/name', page: 'name'})
  .add({
    name: 'article',
    pattern: '/article/:id',
    page: 'article',
  })
  .add({
    name: 'reply',
    pattern: '/reply/:id',
    page: 'reply',
  });
