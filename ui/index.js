const statics = require('./shared/statics');

module.exports.init = app => {

  app.use((ctx, next) => {

    if (ctx.path === '/') return void ctx.redirect('/client/ui.html');

    next();

  });

  // /tests/
  // /client/
  app.use(statics);

};
