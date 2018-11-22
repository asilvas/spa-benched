import safeWord from './safe-word';

const compileCache = {};

export default function compileStuff(stuff, { useSafeWord, usePriority, limit = 1, priority = 0 }) {
  const tasks = stuff.map(txt => {
    let cache = compileCache[txt];
    if (!cache) {
      cache = compileCache[txt] = useSafeWord ? safeWord(() => new Promise(resolve => {
        resolve(eval(txt));
      }), { priority: usePriority ? priority : Math.random(), limit }) : new Promise(resolve => {
        resolve(eval(txt));
      });
    }
    return cache;
  });

  return Promise.all(tasks);
}
