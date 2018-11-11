const path = require('path');
const fs = require('fs');
const mimeTypes = require('mime-types');

const allowedGroups = ['tests', 'client', 'apps'];

const cache = {};

const absRoot = path.resolve(__dirname, '../..');

module.exports = (ctx, next) => {
  const matchingGroups = allowedGroups.filter(grp => (new RegExp(`^\/${grp}\/`).test(ctx.path)));
  const group = matchingGroups[0];
  if (!group) return next(); // not a static group

  ctx.type = mimeTypes.lookup(path.extname(ctx.path)) || 'application/octet-stream';

  let cacheO = ctx.canCache ? cache[ctx.path] : undefined;
  if (typeof cacheO !== 'undefined') {
    if (!cacheO) {
      ctx.status = 404;
    } else {
      ctx.body = cacheO;
    }

    return;
  }

  // always try /dist/ first
  let absPath = path.join(absRoot, 'dist', ctx.path);
  if (fs.existsSync(absPath)) {
    cacheO = fs.readFileSync(absPath, 'utf8');
    ctx.body = cache[ctx.path] = cacheO;
    return;
  }

  // then root
  absPath = path.join(absRoot, ctx.path);
  if (fs.existsSync(absPath)) {
    cacheO = fs.readFileSync(absPath, 'utf8');
    ctx.body = cache[ctx.path] = cacheO;
  } else {
    // not found
    ctx.status = 404;
    cache[ctx.path] = null;
  }
};
