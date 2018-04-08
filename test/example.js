const koa2Oas3 = require('../');

const _ = require('koa-route');
const Koa = require('koa');
const app = new Koa();

koa2Oas3(app, 'https://api.swaggerhub.com/apis/overspeedio/Koa2Oas3Example/1.0.0')
  .then(() => {
    app.use(_.get('/pet/:id', (ctx, id) => {
      ctx.body = {
        id,
        name: 'tobi'
      };
    }));

    app.listen(3000);
  })
  .catch((e) => {
    console.error(e);
  });
