const compress = require('kompression');
const canCache = require('./can-cache');

module.exports.init = app => {

  // gzip & brotli
  app.use(compress({
    filter: contentType => /^(text|application\/javascript)/.test(contentType),
    threshold: 1024
  }));

  app.use(canCache);

  // TODO: add throttling

};
