import Preact, { createElement, render } from 'preact';
import getApp from '../_shared/react/get-App';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false); // for performance

const App = getApp(Preact);

const stateManager = (latestState, reducer, action) => produce(latestState, draft => {
  reducer(draft, action);
});

render(createElement(App, { useSafeWord: true, stateManager }), document.body);
