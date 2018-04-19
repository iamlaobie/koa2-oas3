const koa2OA3 = require('../');
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
