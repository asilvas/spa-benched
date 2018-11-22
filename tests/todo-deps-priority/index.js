import initialState from './initial-state';

function sortByIndex(a, b) {
  return a.index === b.index ? (a.originalIndex < b.originalIndex ? -1 : 1) : (a.index < b.index) ? -1 : 1;
}

function shiftIndexes(times, offset = 0, negative = false) {
  const states = [];
  let newI;

  const getNextState = i => ({
    onComplete: !negative ? 'SHIFT-INDEXES' : 'SHIFT-INDEXES-NEG',
    verify: [{ match: '#id0', test: el => {
      return el.attributes['data-index'].nodeValue === i.toString()
    }}]
  });

  for (let i = 0; i < times; i++) {
    newI = !negative ? ((i + offset) % initialState.length) : (offset - i);
    while (newI < 0) newI += initialState.length;
    states.push(getNextState(newI));
  }

  return states;
}

export default {
  initialState,
  states: [
    //...shiftIndexes(50),
    //...shiftIndexes(50, 50, true),
    { verify: [{ match: '#id0', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id1', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id2', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id3', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id4', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id5', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id6', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id7', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id8', test: el => el.attributes.class.nodeValue === `todo state-ready` }] },
    { verify: [{ match: '#id9', test: el => el.attributes.class.nodeValue === `todo state-ready` }] }
  ],
  reducer: (draft, action) => {
    switch (action.type) {
      case 'SHIFT-INDEXES':
        draft.forEach(todo => { todo.index = (todo.index + 1) % draft.length });
        draft.sort(sortByIndex);
      break;
      case 'SHIFT-INDEXES-NEG':
        draft.forEach(todo => { todo.index = todo.index - 1; if (todo.index < 0) todo.index += draft.length; });
        draft.sort(sortByIndex);
      break;
      case 'LOAD_STATE':
        // this is horrible O(N), but was necessary as < 1% of the time we could not rely on index for reasons unknown
        const el = draft.find(e => e.id === action.el.id);
        el.loadState = action.loadState;
        //draft[action.index].loadState = action.loadState;
      break;
      default:
        console.warn(`Unrocognized action: ${action.type}`);
    }
  }
};
