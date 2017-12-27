# rumors-site

[![Build Status](https://travis-ci.org/cofacts/rumors-site.svg?branch=master)](https://travis-ci.org/cofacts/rumors-site) [![Coverage Status](https://coveralls.io/repos/github/cofacts/rumors-site/badge.svg?branch=master)](https://coveralls.io/github/cofacts/rumors-site?branch=master)

Rumors list / creation UI, with server-side rendering

## Development

This project uses NodeJS 8+ and npm 5+.

``` bash
$ npm install
$ npm run dev

# Instead of production api server, you could use local server https://github.com/MrOrz/rumors-api
$ USE_LOCAL=1 npm run dev

# Before you pull request, please lint your code first
$ npm run lint 
# fix eslint 
$ npm run lint:fix
```

### ENV vars and Cache issue

If you found that `USE_LOCAL` does not work (i.e. the server still sends to production server even when `USE_LOCAL` is set), try removing `node_modules/.cache`. This is [an known issue](https://github.com/zeit/next.js/issues/1103).

### styled-jsx syntax highlighting

See: https://github.com/zeit/styled-jsx#syntax-highlighting

## Deploy

Build docker image

```
$ npm run build
```

Run the docker image on local machine, then visit `http://localhost:3000`.

```
$ docker run --rm -p 3000:3000 -e "PORT=3000" mrorz/rumors-site
```

Push to dockerhub
```
$ docker push mrorz/rumors-site
```

## Design and Mockups

* [真的假的 hackfoldr](http://beta.hackfoldr.org/rumors)
* [網站 UI flow](https://i.imgur.com/lxas2Ic.jpg)
