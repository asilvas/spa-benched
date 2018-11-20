import React, { useState } from 'react';
import BenchRunning from './BenchRunning';
import RunBench from './RunBench';

export default () => {
  const [isRunning, setIsRunning] = useState(false);
  
  return isRunning
    ? <BenchRunning setIsRunning={setIsRunning} />
    : <RunBench setIsRunning={setIsRunning} />
  ;
}
