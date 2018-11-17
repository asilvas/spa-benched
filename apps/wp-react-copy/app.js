import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import getApp from '../_shared/react/get-App';
import extend from 'extend';

const App = getApp(React);

const stateManager = (latestState, reducer, action) => {
  const draft = extend(true, [], latestState);
  reducer(draft, action);
  return draft; // state is mutated in-place, but not returned
}

// legacy React
ReactDOM.render(createElement(App, { useSafeWord: false, stateManager }), document.body);
// concurrent React (not sure why I'm seeing `didTimeout` errors)
//ReactDOM.createRoot(document.body).render(createElement(App));
