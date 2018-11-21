import loadStuff from '../util/load-stuff';
import compileStuff from '../util/compile-stuff';

const test = window.test;
const bench = window.bench;
const { LOAD_STATES } = bench;

export default ({ html, render }) => {
  return function Child({ el, index }) {
    const loadState = el.loadState;
    const inner = el.text(el, { loadState });
    const className = el.classes(el, { loadState });
    const propsOrig = el.props(el, { loadState });
  
    if (loadState === LOAD_STATES.PENDING) {
      if (!el.modules || el.modules.length === 0) {
        test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY });
      } else {
        test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.LOADING });
        loadStuff(el.modules, el.useSafeWord).then(stuff => {
          test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.COMPILING });
          compileStuff(stuff, el.useSafeWord).then(() => test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY }));
        });
      }
    }
  
    // LIMIT 1: The tag must be part of the string itself and cannot be an argument. hopefully that can be fixed in the future
    // LIMIT 2: Cannot supply concatenated props?! MAJOR LIMITATION! Hardcoding for demo purposes....
    switch (el.tag) {
      case 'span':
      return html`<span id="${el.id}" class="${className}" data-index="${propsOrig.index}" data-name="${propsOrig.name}">${inner}</span>`;
      default: // div
      return html`<div id="${el.id}" class="${className}" data-index="${propsOrig.index}" data-name="${propsOrig.name}">${inner}</div>`;
    }
  }  
}
