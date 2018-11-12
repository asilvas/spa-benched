import { render, Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import getApp from '../_shared/react/get-App';

const Inferno = { createElement, Component };
const App = getApp(Inferno);

render(createElement(App), document.body);
