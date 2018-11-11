import safeWord from './safe-word';

const fetchCache = {};

export default function loadStuff(modules) {
  return Promise.all(modules.map(mod => {
    let cache = fetchCache[mod];
    if (cache) return cache;
    cache = fetchCache[mod] = safeWord(fetch(mod)).then(res => res.text());
    return cache;
  }));
}
