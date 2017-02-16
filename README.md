# rumors-site
Rumors list / creation UI, with server-side rendering

## Development

``` bash
$ yarn
$ npm run dev

# Instead of production api server, you could use local server https://github.com/MrOrz/rumors-api
$ USE_LOCAL=1 npm run dev
```

### styled-jsx syntax highlighting

#### Atom

From https://github.com/gandm/language-babel/issues/324:

![styled-jsx syntax highlight in Atom](https://cloud.githubusercontent.com/assets/2313237/22627258/6c97cb68-ebb7-11e6-82e1-60205f8b31e7.png)

1. Install `language-postcss` and `language-babel`. Make sure `language-babel` has version >= 2.54.0.
2. Open up `laguage-babel`'s setting page
3. Set `Javascript Tagged Template Literal Grammar Extensions` to : `"(?<=<style jsx>{)|(?<=<style jsx global>{)":source.css.scss`
4. Wait for 10 seconds for this to apply

#### Other editors
![自求多福](http://i.imgur.com/YqN4wEv.png)

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
