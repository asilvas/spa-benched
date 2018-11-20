import React from 'react';
import benchData from '../../webpack/bench-data.json';


export default ({ setIsRunning }) => {
  return (<div className="container">
    <div className="alert alert-info">
      <div className="row">
        <div className="col-sm">
          <button className="btn btn-primary" onClick={() => setIsRunning(true)}>Run Benchmark</button>
        </div>
        <div className="col-sm" style={{ textAlign: 'right', margin: 'auto 0' }}>
          Tests: <strong>{benchData.tests.length}</strong> Apps: <strong>{benchData.apps.length}</strong>
        </div>
      </div>      
    </div>    
  </div>);
};
