# rumors-site

[![Build Status](https://travis-ci.org/cofacts/rumors-site.svg?branch=master)](https://travis-ci.org/cofacts/rumors-site) [![Coverage Status](https://coveralls.io/repos/github/cofacts/rumors-site/badge.svg?branch=master)](https://coveralls.io/github/cofacts/rumors-site?branch=master)

Rumors list / creation UI, with server-side rendering.

## Configuration

For development, copy `.env.sample` to `.env` and make necessary changes.

For production via [rumors-deploy](http://github.com/cofacts/rumors-deploy), do setups in `docker-compose.yml`.

## Development

This project uses NodeJS 12+.

``` bash
$ npm install
$ npm run dev # Then visit http://localhost:3000

# Before you pull request, please lint your code first
$ npm run lint
# fix eslint
$ npm run lint:fix
# run test
$ npm t
```

### styled-jsx syntax highlighting

See: https://github.com/zeit/styled-jsx#syntax-highlighting

## Try built image on local

Build docker image.

``` bash
# build
$ IMAGE_NAME=rumors-site-test hooks/build

```

Run the docker image on local machine, then visit `http://localhost:3000`.

``` bash
$ docker run --rm --env-file .env -p 3000:3000 rumors-site-test:en
```

Our docker cloud is set to automatic build the images specified in `hooks/build` script.

## Design and Mockups

* [真的假的 hackfoldr](http://beta.hackfoldr.org/rumors)
* [網站 UI flow](https://i.imgur.com/lxas2Ic.jpg)
