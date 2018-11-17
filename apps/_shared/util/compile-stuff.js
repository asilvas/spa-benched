import safeWord from './safe-word';

const compileCache = {};

export default function compileStuff(stuff, useSafeWord) {
  const tasks = stuff.map(txt => {
    let cache = compileCache[txt];
    if (!cache) {
      const evalPromise = new Promise(resolve => {
        resolve(eval(txt));
      });
      cache = compileCache[txt] = useSafeWord ? safeWord(evalPromise) : evalPromise;
    }
    return cache;
  });

  return Promise.all(tasks);
}
