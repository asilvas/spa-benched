import initialState from './initial-state';

function sortByIndex(a, b) {
  return a.index === b.index ? (a.originalIndex < b.originalIndex ? -1 : 1) : (a.index < b.index) ? -1 : 1;
}

function shiftIndexes(times, offset = 0) {
  const states = [];
  for (let i = 0; i < times; i++) {
    states.push({
      onComplete: 'SHIFT-INDEXES',
      verify: [{ match: '#id0', test: el => el.attributes['data-index'].nodeValue === ((i + offset) % initialState.length).toString() }]
    })
  }

  return states;
}

export default {
  initialState,
  states: [
    ...shiftIndexes(120),
    {
      onComplete: 'VISUAL_COMPLETE',
      verify: [{ match: '.todo', test: el => el.attributes.class.nodeValue === `todo state-ready` }]
    }
  ],
  reducer: (draft, action) => {
    switch (action.type) {
      case 'SHIFT-INDEXES':
        draft.forEach(todo => { todo.index = (todo.index + 1) % draft.length })
        draft.sort(sortByIndex);
      break;
      case 'VISUAL_COMPLETE':
        benchMark('VISUAL_COMPLETE');
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
