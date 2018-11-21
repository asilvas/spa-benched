import { html, render } from 'lit-html';

import getApp from '../_shared/lit-html/get-App';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false); // for performance

const App = getApp({ html, render });

const test = window.test;

let latestState = test.initialState;
let nextState;
let setStateImmediate;

function setState(state) { // emmulate React'ish setState pattern by deferring states
  nextState = state;
  if (!setStateImmediate) { // avail globally
    setStateImmediate = setImmediate(() => {
      setStateImmediate = null;
      latestState = nextState;
      nextState = null;
      main();
    });
  }
}

const stateManager = (latestState, reducer, action) => produce(latestState, draft => {
  reducer(draft, action);
});

test.dispatch = action => {
  // produce new state (use next if avail, otherwise latest)
  setState(stateManager(nextState || latestState, test.reducer, action));
};

const appEl = document.getElementById('app');

function main() {
  render(App({ useSafeWord: true, state: { data: latestState } }), appEl);
}

main();
