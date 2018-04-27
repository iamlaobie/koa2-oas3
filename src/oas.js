'use strict';

const {
  ChowError,
  default: ChowChow
} = require('oas3-chow-chow');

exports.oas = function oas (apiSpec, {
  handleError
}) {
  const compiled = new ChowChow(apiSpec);

  return async (ctx, next) => {
    try {
      compiled.validateRequest(ctx.path, {
        method: ctx.request.method,
        header: ctx.request.header,
        query: ctx.request.query,
        path: ctx.params,
        cookie: ctx.cookies,
        body: ctx.request.body
      });
    } catch (e) {
      if (e instanceof ChowError) {
        const err = e.toJSON();
        ctx.throw(err.code, JSON.stringify(handleError(err)));
      } else {
        const err = { code: '400' };
        ctx.throw(err.code, JSON.stringify(handleError(err)));
      }
    }

    await next();
  };
};
