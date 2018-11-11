import safeWord from './safe-word';

const compileCache = {};

export default function compileStuff(stuff) {
  const tasks = stuff.map(txt => {
    let cache = compileCache[txt];
    if (!cache) {
      cache = compileCache[txt] = safeWord(new Promise(resolve => {
        resolve(eval(txt));
      }));
    }
    return cache;
  });

  return Promise.all(tasks);
}
