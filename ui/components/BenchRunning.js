import React, { useReducer, useEffect } from 'react';
import benchData from '../../webpack/bench-data.json';
import Benchmark from './Benchmark';
import ChartOverallTimesStacked from './charts/ChartOverallTimesStacked';
import ChartOverallTimes from './charts/ChartOverallTimes';
import ChartFramesOverTime from './charts/ChartFramesOverTime';

const initialState = { isRunning: true, appIndex: 0, testIndex: 0, results: [] };
const stepCount = benchData.apps.length * benchData.tests.length;

const reducer = (state, action) => {
  const draft = Object.assign({}, state); // shallow copy is sufficient for our simple state

  switch (action.type) {
    case 'RESET':
    return initialState;
    case 'COMPLETE':
      draft.results.push({
        app: benchData.apps[draft.appIndex],
        test: benchData.tests[draft.testIndex],
        bench: action.bench
      });
      draft.testIndex++;
      if (draft.testIndex >= benchData.tests.length) {
        draft.testIndex = 0;
        draft.appIndex++;
        if (draft.appIndex >= benchData.apps.length) {
          draft.isRunning = false; // complete
        }
      }
    break;
    default:
      console.warn('oops! unrecognized reducer action.');
    break;
  }

  return draft;
};

export default ({ setIsRunning }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const listener = ({ data }) => {
      if (data.action) { // if action supplied, consider it sufficiently validated to forward to dispatcher
        dispatch(data.action);
      }
    };
    window.addEventListener('message', listener, false);
    return () => window.removeEventListener('message', listener);
  }, []);

  const fpsCharts = benchData.apps.map(app => <ChartFramesOverTime results={state.results} app={app} />);

  if (!state.isRunning) {
    return (<div className="container">
      <div className="alert alert-success">
        <div className="row">
          <div className="col-sm">
            <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESET' })}>Run Again</button>
          </div>
          <div className="col-sm" style={{ textAlign: 'right', margin: 'auto 0' }}>
            Test Complete!
          </div>
        </div>      
      </div>    
      
      <h3>Results</h3>
      <ChartOverallTimesStacked results={state.results} />
      <ChartOverallTimes results={state.results} />
      {fpsCharts}
    </div>);
  }

  const app = benchData.apps[state.appIndex];
  const test = benchData.tests[state.testIndex];
  const step = (state.appIndex * benchData.tests.length) + state.testIndex + 1;

  return (<>
    <div className="benchOverlay"><button className="btn btn-secondary" onClick={() => setIsRunning(false)}>Stop Benchmark</button> <>Run {step} of {stepCount}, App: <strong>{app.name}</strong>, Test: <strong>{test.name}</strong></></div>
    <Benchmark app={app} test={test} dispatch={dispatch} />
  </>);
};
