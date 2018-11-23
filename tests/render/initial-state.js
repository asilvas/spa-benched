const todos = [];

const CHILD_COUNT = 200;

for (let i = 0; i < CHILD_COUNT; i++) {
  todos.push({
    id: `id${i}`,
    tag: 'div',
    loadState: 'Pending',
    classes: me => `todo state-${me.loadState.toLowerCase()}`,
    props: me => ({ index: me.index }),
    originalIndex: i,
    index: i,
    text: me => `TODO #${me.originalIndex} is ${me.loadState || 'unknown'}`
  });
}

export default todos;
