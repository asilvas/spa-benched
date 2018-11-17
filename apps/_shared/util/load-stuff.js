import safeWord from './safe-word';

const fetchCache = {};

export default function loadStuff(modules, useSafeWord) {
  return Promise.all(modules.map(mod => {
    let cache = fetchCache[mod];
    if (cache) return cache;
    cache = fetchCache[mod] = (useSafeWord ? safeWord(fetch(mod)) : fetch(mod)).then(res => res.text());
    return cache;
  }));
}
