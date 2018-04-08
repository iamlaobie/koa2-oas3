const {
  ChowError,
  default: ChowChow
} = require('oas3-chow-chow');

exports.oas = function oas (apiSpec, config) {
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
        const {
          code,
          location,
          message
        } = e.toJSON();

        ctx.throw(code, JSON.stringify({
          errors: [{
            status: `${code}`,
            title: 'Request Validation Error',
            detail: message,
            source: location
          }]
        }));
      } else {
        ctx.throw(400, JSON.stringify({
          errors: [{
            status: '400',
            title: 'Request Validation Error'
          }]
        }));
      }
    }

    await next();
  };
};
