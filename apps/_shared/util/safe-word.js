import plimit from 'p-limit';

const limit = plimit(1); // concurrency

export default function safeWord(fn) {
  return limit(() => new Promise(resolve => {
    setImmediate(resolve.bind(null, fn));
  }));
}
