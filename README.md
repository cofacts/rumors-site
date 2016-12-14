# rumors-site
Rumors list / creation UI, with server-side rendering

## Development

```
$ yarn
$ npm run dev
```

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
