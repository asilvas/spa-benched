import loadStuff from '../util/load-stuff';
import compileStuff from '../util/compile-stuff';

const test = window.test;
const bench = window.bench;
const { LOAD_STATES } = bench;

export default React => {
  return function Child({ el, index, useSafeWord, usePriority, limit = 2 }) {
    const loadState = el.loadState;
    const inner = el.text(el, { loadState });
    const className = el.classes(el, { loadState });
    const propsOrig = el.props(el, { loadState });
    const propKeys = propsOrig && Object.keys(propsOrig) || [];
    const props = propKeys.reduce((state, key) => {
      state[`data-${key}`] = propsOrig[key];
      return state;
    }, {});
  
    if (loadState === LOAD_STATES.PENDING) {
      if (!el.modules || el.modules.length === 0) {
        test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY });
      } else {
        test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.LOADING });
        loadStuff(el.modules, { useSafeWord, usePriority, priority: el.priority, limit }).then(stuff => {
          test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.COMPILING });
          compileStuff(stuff, { useSafeWord, usePriority, priority: el.priority, limit }).then(() => test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY }));
        });
      }
    }
  
    return React.createElement(el.tag, {
      id:el.id,
      key:el.id,
      className,
      ...props
    }, inner);
  }  
}
