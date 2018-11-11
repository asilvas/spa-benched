import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import getApp from '../_shared/react/get-App';

const App = getApp(React);

// legacy React
ReactDOM.render(createElement(App), document.body);
// concurrent React (not sure why I'm seeing `didTimeout` errors)
//ReactDOM.createRoot(document.body).render(createElement(App));
