import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import getApp from '../_shared/react/get-App';

const App = getApp(React);

const stateManager = (latestState, reducer, action) => {
  reducer(latestState, action);
  return latestState; // state is mutated in-place, but not returned
}

// legacy React
ReactDOM.render(createElement(App, { useSafeWord: false, stateManager }), document.getElementById('app'));
// concurrent React (not sure why I'm seeing `didTimeout` errors)
//ReactDOM.createRoot(document.getElementById('app')).render(createElement(App));
