# OpenAPI 3 Koa 2 Request Validation Middleware

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Requirements

```
Node.js Version 8+
OpenAPI 3
Koa2
```

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

## koa2OA3 Function Params

| Name      | Type              | Required | Description                                                                                                                                 |
|-----------|-------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| app       | Koa2 App Instance | true     | A Koa2 app instance you want the middleware to be applied to.                                                                               |
| specOrUri | String / Object   | true     | Either a URI to a swagger specification Koa2-OAS3 can grab down and apply, or a JavaScript object that contains the OpenAPI3 specification. |
| options   | Object            | false    | Custom options to pass to the middleware, see all options below.                                                                            |

## Allowed Options and Defaults

| Option                      | Type     | Default                                   | Description                                                                                                                                                                              |
|-----------------------------|----------|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mergeRemoteRefs             | Boolean  | false                                     | OpenAPI 3 allows you to reference from other api specifications based on a URI. This option will reach out to these different refs and merge the definitions into the provided API spec. |
| renderDocs                  | Boolean  | true                                      | This renders a UI to visualize the OpenAPI specification.                                                                                                                                |
| docsPath                    | String   | /docs                                     | What path should the docs be rendered at. In addition a second route will be rendered {docsPath}/spec that responds with the api specification in JSON format.                           |
| docsSuupportedSubmitMethods | Array    | ['get', 'post', 'put', 'delete', 'patch'] | In the DOC's interactive interface example requests can be submitted to the configured API spec remotes. This allows adding limitations on the feature.                                  |
| docsJsonEditor              | Boolean  | false                                     | Should the JSON editor be visible in the render documentation view.                                                                                                                      |
| docsShowRequestHeaders      | Boolean  | false                                     | https://www.npmjs.com/package/koa2-swagger-ui                                                                                                                                            |
| docsHideTopbar              | Boolean  | true                                      | https://www.npmjs.com/package/koa2-swagger-ui                                                                                                                                            |
| docsAuthOptions             | Object   | {}                                        | https://www.npmjs.com/package/koa2-swagger-ui                                                                                                                                            |
| docDdefaultModelRendering   | String   | schema                                    | https://www.npmjs.com/package/koa2-swagger-ui                                                                                                                                            |
| handleError                 | Function | See below code snippet                    |                                                                                                                                                                                          |

## Default Error Handle

```javascript
const handleError = ({ code, location, message }) => {
  return {
    errors: [{
      status: `${code}`,
      title: 'Request Validation Error',
      detail: message,
      source: location
    }]
  };
}
```
