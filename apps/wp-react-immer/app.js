import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { produce, setAutoFreeze } from 'immer';

setAutoFreeze(false); // for performance

const test = window.test;
const bench = window.bench;

const body = document.getElementById('body');

const { LOAD_STATES } = bench;

const fetchCache = {};
const compileCache = {};

function loadStuff(modules) {
  return Promise.all(modules.map(mod => {
    let cache = fetchCache[mod];
    if (cache) return cache;
    cache = fetchCache[mod] = fetch(mod).then(res => res.text());
    return cache;
  }));
}

function compileStuff(stuff) {
  const tasks = stuff.map(txt => {
    let cache = compileCache[txt];
    if (!cache) {
      cache = compileCache[txt] = new Promise(resolve => {
        resolve(eval(txt));
      });
    }
    return cache;
  });

  return Promise.all(tasks);

  // probably no value in the below series logic unless they are deferred to one per frame

  // leverage reduce as we want to perform these tasks in series
  /*const results = stuff.reduce((promiseChain, stuff) => {
    return promiseChain.then(chainResults => {
      let cache = compileCache[stuff];
      if (id === 'id157') console.log('Compiling...', id, cache ? 'cached' : 'not cached', stuff.length);
      if (!cache) {
        cache = compileCache[stuff] = new Promise(resolve => resolve(eval(stuff)) );
      }
      // task is blocking
      return [ ...chainResults, cache ];
    })
  }, Promise.resolve([]));

  return results;*/
}

function Child({ el, index }) {
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
      loadStuff(el.modules).then(stuff => {
        test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.COMPILING });
        compileStuff(stuff).then(() => test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY }));
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

function App() {
  const [state, dispatch] = useReducer(produce(test.reducer), test.initialState);
  test.dispatch = dispatch;

  const children = state.map((el, index) => <Child el={el} index={index} />);

  return (<div>{children}</div>)
}

// legacy React
ReactDOM.render(<App />, body);
// concurrent React
//ReactDOM.createRoot(body).render(<App />);
