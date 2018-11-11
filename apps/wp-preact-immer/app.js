import Preact, { createElement, render } from 'preact';
import getApp from '../_shared/react/get-App';

const App = getApp(Preact);

render(createElement(App), document.body);
