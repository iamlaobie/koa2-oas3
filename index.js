'use strict';

const apiMergeRemoteRefs = require('@overspeed/oas3-remote-refs');
const koaSwagger = require('koa2-swagger-ui');
const rpn = require('request-promise-native');
const { isObject } = require('lodash');
const { oas } = require('./src/oas3-koa-mw');

// Exports
module.exports = Koa2OA3;

// These are the default options for Koa2OA3
const defaultOptions = {
  mergeRemoteRefs: true,
  renderDocs: true
};

/**
 * Apply Koa2 OpenAPI 3 Request Validation Layer
 * @param {Koa} app Koa app instance
 * @param {(String|Object)} apiSpecOrUri Provide either a uri or a swagger spec object
 * @param {Object} [options] Optional options object
 * @param {Boolean} [mergeRemoteRefs=true] Should any remote refs be merged to local definitions?
 * @param {Boolean} [renderDocs=true] Should a swagger ui be rendered?
 */
async function Koa2OA3(app, apiSpecOrUri, {
  // TODO: more in depth optiosn for rendering ui
  mergeRemoteRefs,
  renderDocs
  // TODO: more in depth options for request validation
} = defaultOptions) {
  let isValidUri = true;
  let apiSpec;

  // get api specification
  if (mergeRemoteRefs) {
    // merge remote refs from api spec
    apiSpec = await apiMergeRemoteRefs(apiSpecOrUri);
  } else if (isObject(apiSpecOrUri)) {
    // just set the apiSpec
    apiSpec = apiSpecOrUri;
  } else if (isValidUri) {
    // fetch api spec from uri
    const res = await rpn(apiSpecOrUri);
    apiSpec = JSON.parse(rawApiSpec);
  } else {
    // invalid options
    throw new Error('Invalid api spec or api spec uri provied');
  }

  /**
   * Determine the swagger doc url to use for the ui layer
   */
  const determineSwaggerDocUrl = () => {
    // TODO: eventually this could be a remote url or a local url
    // if local url we will need to have koa render the api spec json
    // in a get request somewhere
    return apiSpecUri;
  }

  // only add ui layer if render docs option is true
  if (renderDocs) {
    // apply ui layer
    app.use(koaSwagger({
      // title: apiSpec.info.title,
      hideTopbar: true,
      swaggerOptions: {
        url: determineSwaggerDocUrl()
      }
    }));
  }

  // apply request validation
  app.use(oas(apiSpec));
}
