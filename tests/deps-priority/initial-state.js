const todos = [];

const CHILD_COUNT = 200;
const UNIQUE_MODULES = 50;
const KB_MOD = 3;
const MIN_KB = 50;

for (let i = 0; i < CHILD_COUNT; i++) {
  todos.push({
    id: `id${i}`,
    priority: i,
    tag: 'div',
    loadState: 'Pending',
    classes: (me, { loadState }) => `todo state-${loadState.toLowerCase()}`,
    props: (me) => ({ index: me.index, module: me.modules[0] }),
    originalIndex: i,
    index: i,
    modules: [`/api/dummy.cjs?sizeKB=${((i % UNIQUE_MODULES) * KB_MOD) + MIN_KB}`],
    text: (me, { loadState }) => `TODO #${me.originalIndex} is ${loadState || 'unknown'}`
  });
}

export default todos;
