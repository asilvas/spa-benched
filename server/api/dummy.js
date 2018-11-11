const path = require('path');
const crypto = require('crypto');
const mimeTypes = require('mime-types');

const TYPES = {
  '.txt': dummyText,
  '.cjs': dummyCJS,
  '.js': dummyJS,
  '.css': dummyCSS
};

module.exports = (ctx, next) => {
  // check for dummy path
  if (!/\/dummy\./.test(ctx.path)) return next();

  const ext = path.extname(ctx.path);

  const sizeKB = parseInt(ctx.query.sizeKB) || 1;

  const type = TYPES[ext];
  if (!type) { // unsupported
    ctx.status = 415;
    return;
  }

  ctx.type = mimeTypes.lookup(path.extname(ctx.path)) || 'application/javascript';
  ctx.body = type(sizeKB);

  return next();
};

function dummyText(sizeKB) {
  return crypto.randomBytes(sizeKB * 1024 / 2).toString('hex');
}

function dummyCJS(sizeKB) {
  return `module.exports=${dummyJS(sizeKB)}`;
}

function dummyJS(sizeKB) {
  let ret = '(function() { let sum = 0;'
  const maxSizeB = sizeKB * 1024;
  while (ret.length < maxSizeB) {
    ret += `sum += ${Math.random()};\n`;
  }
  return `${ret} return sum; })();`;
}

function dummyCSS(sizeKB) {
  let ret = ''
  const maxSizeB = sizeKB * 1024;
  while (ret.length < maxSizeB) {
    ret += `.cls${crypto.randomBytes(50).toString('hex')} { display:block; }\n`;
  }
  return ret;
}
