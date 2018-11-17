const h2 = require('http2');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const middleware = require('./middleware');
const api = require('./api');
const ui = require('../ui');

const app = new Koa();

async function main() {

  await middleware.init(app);
  await api.init(app);
  await ui.init(app);

  const server = h2.createSecureServer({
    key: fs.readFileSync(path.join(__dirname, './ssl/localhost-privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, './ssl/localhost-cert.pem'))
  }, app.callback());

  server.listen(13337);

  console.log('https://localhost:13337/');

}

main();
