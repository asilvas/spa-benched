

module.exports = (ctx, next) => {
  const { query, headers } = ctx;

  const reqCanCache = query.cache !== 'false';
  const refererCanCache = !query.cache && (!headers.referer || !/cache=false/.test(headers.referer));
  ctx.canCache = query.cache ? reqCanCache : refererCanCache;

  next();
};
