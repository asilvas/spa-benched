import Preact, { createElement, render } from 'preact';
import getApp from '../_shared/react/get-App';

const App = getApp(Preact);

const stateManager = (latestState, reducer, action) => {
  reducer(latestState, action);
  return latestState; // state is mutated in-place, but not returned
}

render(createElement(App, { stateManager }), document.body);
