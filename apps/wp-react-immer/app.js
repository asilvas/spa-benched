import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import getApp from '../_shared/react/get-App';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false); // for performance

const App = getApp(React);

const stateManager = (latestState, reducer, action) => produce(latestState, draft => {
  reducer(draft, action);
});

// legacy React
ReactDOM.render(createElement(App, { useSafeWord: false, stateManager }), document.body);
// concurrent React (not sure why I'm seeing `didTimeout` errors)
//ReactDOM.createRoot(document.body).render(createElement(App));
