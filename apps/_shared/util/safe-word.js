import plimit from 'p-limit';

let gLimit;
let priorityQueue = [];
let nextBatchTimer;

export default function safeWord(fn, { limit = 1, priority = 0 } = {}) {
  const lLimit = gLimit || plimit(limit); // concurrency

  // this promise code is a little scary... PR welcome to simplify ;-)
  return new Promise(resolve => {

    priorityQueue.push({ fn, priority, resolve });
    if (!nextBatchTimer) {
      nextBatchTimer = setImmediate(() => {
        priorityQueue.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
        priorityQueue.forEach(({ fn, resolve }) => {
          lLimit(() => new Promise(resolveLimit => {
            setImmediate(() => {
              resolve(fn().then(val => { resolveLimit(); return val; }));
            });
          }));
        });
    
        priorityQueue = [];
        nextBatchTimer = null;
      });
    }

  });
}
