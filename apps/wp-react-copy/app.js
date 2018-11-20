import React, { createElement } from 'react';
import { render } from 'react-dom';
import getApp from '../_shared/react/get-App';
import extend from 'extend';

const App = getApp(React);

const stateManager = (latestState, reducer, action) => {
  const draft = extend(true, [], latestState);
  reducer(draft, action);
  return draft; // state is mutated in-place, but not returned
}

// legacy React
render(createElement(App, { useSafeWord: false, stateManager }), document.getElementById('app'));
// concurrent React (not sure why I'm seeing `didTimeout` errors)
//ReactDOM.createRoot(document.getElementById('app')).render(createElement(App));
