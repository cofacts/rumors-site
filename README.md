# rumors-site

[![Build Status](https://travis-ci.org/cofacts/rumors-site.svg?branch=master)](https://travis-ci.org/cofacts/rumors-site) [![Coverage Status](https://coveralls.io/repos/github/cofacts/rumors-site/badge.svg?branch=master)](https://coveralls.io/github/cofacts/rumors-site?branch=master)

Rumors list / creation UI, with server-side rendering

## Development

This project uses NodeJS 8+ and npm 5+.

``` bash
$ npm install
$ npm run dev # Then visit http://localhost:3000

# By default the site will connect to staging API server.
# If you started your own API server using docker-compose in https://github.com/MrOrz/rumors-api,
# Use this instead:
$ BUILD_TARGET=local npm run dev

# Before you pull request, please lint your code first
$ npm run lint
# fix eslint
$ npm run lint:fix
```

### ENV vars and Cache issue

If you found that `BUILD_TARGET` does not work (i.e. the server still sends to production server even when `BUILD_TARGET` is set), try removing `node_modules/.cache`. This is [an known issue](https://github.com/zeit/next.js/issues/1103).

### styled-jsx syntax highlighting

See: https://github.com/zeit/styled-jsx#syntax-highlighting

## Deploy

Build docker image

```
# Production build
$ npm run build

# Staging build
$ npm run build:staging
```

Run the docker image on local machine, then visit `http://localhost:3000`.

```
$ docker run --rm -p 3000:3000 -e "PORT=3000" mrorz/rumors-site
```

Push to dockerhub
```
# Production
$ docker push mrorz/rumors-site

# Staging
$ docker push mrorz/rumors-site:staging
```

## Design and Mockups

* [真的假的 hackfoldr](http://beta.hackfoldr.org/rumors)
* [網站 UI flow](https://i.imgur.com/lxas2Ic.jpg)
