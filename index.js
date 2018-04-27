'use strict';

const apiMergeRemoteRefs = require('@overspeed/oas3-remote-refs');
const koaSwagger = require('koa2-swagger-ui');
const rpn = require('request-promise-native');
const { isObject, isString } = require('lodash');
const route = require('koa-route');
const urlJoin = require('url-join');
const { oas } = require('./src/oas');

// Exports
module.exports = koa2OA3;

/**
 * Validate URI
 * @param {String} value
 */
function validateUrl (value) {
  if (isString(value)) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }
}

/**
 * Apply Koa2 OpenAPI 3 Request Validation Layer
 * @param {Koa} app Koa app instance
 * @param {(String|Object)} apiSpecOrUri Provide either a uri or a swagger spec object
 * @param {Object} [options] Optional options object
 * @param {Boolean} [options.mergeRemoteRefs=true] Should any remote refs be merged to local definitions?
 * @param {Boolean} [options.renderDocs=true] Should a swagger ui be rendered?
 * @param {String} [options.docsPath='/docs'] Docs path
 */
async function koa2OA3 (app, apiSpecOrUri, {
  mergeRemoteRefs = false,
  renderDocs = true,
  docsPath = '/docs',
  docsSuupportedSubmitMethods = ['get', 'post', 'put', 'delete', 'patch'],
  docsJsonEditor = false,
  docsShowRequestHeaders = false,
  docsHideTopbar = true,
  docsAuthOptions = {},
  docDdefaultModelRendering = 'schema',
  handleError = ({ code, location, message }) => {
    return {
      errors: [{
        status: `${code}`,
        title: 'Request Validation Error',
        detail: message,
        source: location
      }]
    };
  }
  // TODO: more in depth options for request validation
}) {
  let apiSpec;

  // get api specification
  if (mergeRemoteRefs) {
    // merge remote refs from api spec
    apiSpec = await apiMergeRemoteRefs(apiSpecOrUri);
  } else if (isObject(apiSpecOrUri)) {
    // just set the apiSpec
    apiSpec = apiSpecOrUri;
  } else if (validateUrl(apiSpecOrUri)) {
    // fetch api spec from uri
    const res = await rpn(apiSpecOrUri);
    apiSpec = JSON.parse(res);
  } else {
    // invalid options
    throw new Error('Invalid api spec or api spec uri provied');
  }

  // only add ui layer if render docs option is true
  if (renderDocs) {
    // determine the spec path
    const specPath = urlJoin('/', docsPath, '/spec');

    // add docs api spec
    app.use(route.get(specPath, (ctx) => {
      ctx.body = apiSpec;
    }));

    // apply ui layer
    app.use(koaSwagger({
      title: apiSpec.info.title, // page title
      oauthOptions: docsAuthOptions, // passed to initOAuth
      swaggerOptions: { // passed to SwaggerUi()
        url: specPath, // link to swagger.json
        supportedSubmitMethods: docsSuupportedSubmitMethods,
        jsonEditor: docsJsonEditor,
        defaultModelRendering: docDdefaultModelRendering,
        showRequestHeaders: docsShowRequestHeaders
      },
      routePrefix: urlJoin('/', docsPath), // route where the view is returned
      hideTopbar: docsHideTopbar // hide swagger top bar
    }));
  }

  // apply request validation
  app.use(oas(apiSpec, {
    handleError
  }));
}
