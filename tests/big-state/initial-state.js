import blob from './blob';
import extend from 'extend';

const todos = [];

const CHILD_COUNT = 200;

for (let i = 0; i < CHILD_COUNT; i++) {
  todos.push({
    id: `id${i}`,
    tag: 'div',
    loadState: 'Pending',
    classes: me => `todo state-${me.loadState.toLowerCase()}`,
    props: me => ({ index: me.index, name: me.blob[me.originalIndex % me.blob.length].name }),
    originalIndex: i,
    index: i,
    blob: extend(true, [], blob),
    text: me => `${me.blob[me.originalIndex % me.blob.length].name} is ${me.loadState || 'unknown'}`
  });
}

export default todos;
