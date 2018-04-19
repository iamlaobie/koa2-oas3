# OpenAPI 3 Koa 2 Request Validation Middleware

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Usage
```javascript
const koa2OA3 = require('@overspeed/koa2-oas3');
const _ = require('koa-route');
const Koa = require('koa');
const app = new Koa();

const specUri = 'https://api.swaggerhub.com/apis/overspeedio/Koa2Oas3Example/1.0.0';

// default options
const koa2OA3Options = {
  mergeRemoteRefs: false,
  renderDocs: true,
  docsPath: '/docs'
};

// apply middleware
koa2OA3(app, specUri, koa2OA3Options)
  .then(() => {
    app.use(_.get('/pet/:id', (ctx, id) => {
      ctx.body = {
        id,
        name: 'tobi'
      };
    }));

    app.listen(3000);

    console.log('listening');
  })
  .catch((e) => {
    console.error(e);
  });
```

## Allowed Options and Defaults

| Option          | Type    | Default | Description                                                                                                                                                                              |
|-----------------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mergeRemoteRefs | Boolean | false   | OpenAPI 3 allows you to reference from other api specifications based on a URI. This option will reach out to these different refs and merge the definitions into the provided API spec. |
| renderDocs      | Boolean | true    | This renders a UI to visualize the OpenAPI specification.                                                                                                                                |
| docsPath        | String  | /docs   | What path should the docs be rendered at. In addition a second route will be rendered {docsPath}/spec that responds with the api specification in JSON format.                           |
