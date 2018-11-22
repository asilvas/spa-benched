import safeWord from './safe-word';

const fetchCache = {};

export default function loadStuff(modules, { useSafeWord, usePriority, limit = 1, priority = 0 }) {
  return Promise.all(modules.map(mod => {
    let cache = fetchCache[mod];
    if (cache) return cache;
    cache = fetchCache[mod] = (useSafeWord ? safeWord(() => fetch(mod), { priority: usePriority ? priority : Math.random(), limit }) : fetch(mod)).then(res => res.text());
    return cache;
  }));
}
