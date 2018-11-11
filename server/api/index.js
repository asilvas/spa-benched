const dummy = require('./dummy');

module.exports.init = app => {
  app.use(dummy);
};
