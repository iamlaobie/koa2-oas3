'use strict';

const apiMergeRemoteRefs = require('oas3-remote-refs');
const koaSwagger = require('koa2-swagger-ui');
const { oas } = require('./src/oas3-koa-mw');

exports.Koa2OA3 = async function (app, apiSpecUri, options = {
  mergeRefs: true,
  ui: true
}) {
  // merge remote refs from api spec
  const apiSpec = await apiMergeRemoteRefs(apiSpecUri);
  // apply ui layer
  app.use(koaSwagger({
    title: apiSpec.info.title,
    hideTopbar: true,
    swaggerOptions: {
      url: apiSpecUri
    }
  }));
  // apply request validation
  app.use(oas(apiSpec));
};