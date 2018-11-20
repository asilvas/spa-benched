import { render, Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import getApp from '../_shared/react/get-App';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false); // for performance

const Inferno = { createElement, Component };
const App = getApp(Inferno);

const stateManager = (latestState, reducer, action) => produce(latestState, draft => {
  reducer(draft, action);
});

render(createElement(App, { useSafeWord: true, stateManager }), document.getElementById('app'));
