const statics = require('./shared/statics');

module.exports.init = app => {

  app.use((ctx, next) => {

    if (ctx.path === '/') return void ctx.redirect('/ui');

    next();

  });

  // /tests/
  // /client/
  app.use(statics);

};
