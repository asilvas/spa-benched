import Preact, { createElement, render } from 'preact';
import getApp from '../_shared/react/get-App';
import extend from 'extend';

const App = getApp(Preact);

const stateManager = (latestState, reducer, action) => {
  const draft = extend(true, [], latestState);
  reducer(draft, action);
  return draft; // state is mutated in-place, but not returned
}

render(createElement(App, { stateManager }), document.body);
