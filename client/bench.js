const MAX_FRAME_MSEC = Math.round(1000 / 60); // ms/sec / Hz
const MAX_FRAMES = 60 /* typical max Hz */ * 60 /* seconds/min */ * 1.0 /* mins */;

const LOAD_STATES = {
  PENDING: 'Pending',
  LOADING: 'Loading',
  WAITING: 'Waiting',
  COMPILING: 'Compiling',
  READY: 'Ready'
};

const bench = {
  app: 'wp-react-immer',
  running: true,
  resumeVerifyIndex: null,
  step: 0,
  fps: { frames: [], lastTick: 0 },
  marks: {},
  LOAD_STATES
};

window.bench = bench;
window.benchApp = benchApp;
window.benchMark = benchMark;
window.benchNextStep = benchNextStep;

let test;

const html = document.getElementsByTagName('html')[0];

function benchApp() {
  // load the benchmark app

  test = window.test;

  const query = /\?(.*?)$/.exec(document.location.href);
  const querySplit = query && query[1].split('&');
  const queryPairs = querySplit && querySplit.map(split => {
    const tuple = split.split('=');
    return { key: tuple[0], value: tuple[1] }
  });
  const queryApp = queryPairs && queryPairs.filter(kvp => kvp.key === 'app');
  bench.app = queryApp && queryApp.length === 1 && queryApp[0].value || bench.app;

  console.log('Loading app...', bench.app);

  const appScript = document.createElement('script');
  appScript.src = `/apps/${bench.app}/app.js`;

  html.appendChild(appScript);

  setImmediate(benchNextStep);
}

function benchMark(eventName) {
  const time = performance.now();

  bench.fps.frames.push({ time, duration:  Math.max(time - bench.fps.lastTick, MAX_FRAME_MSEC) });
  bench.fps.lastTick = time;
  const frames = bench.fps.frames.slice(); // copy
  frames.sort((a, b) => a.duration < b.duration ? -1 : 1);

  const medianFrame = frames.length > 0 && frames[Math.floor(frames.length / 2)];

  const props = {
    frameRate: frames.length > 0 ? frames.length / (time / 1000) : 0,
    frameRateMedian: frames.length > 0 ? 1000 / medianFrame.duration : 0,
    frameRate99th: frames.length > 0 ? 1000 / frames[Math.floor(frames.length * 0.99)].duration : 0
  };

  const slowFrames = frames.filter(f => f.duration > (medianFrame.duration * 1.1));
  props.slowFramesRate = (slowFrames.length / frames.length) * 100;

  const mark = bench.marks[eventName] = {
    ...props,
    time
  }

  parent.postMessage({ action: { type: eventName, bench: { marks: bench.marks, frames: eventName === 'COMPLETE' ? bench.fps.frames : undefined } } }, '*');

  console.log(`benchMark: ${eventName} in ${Math.round(mark.time)}ms`, props);
}

function benchNextStep() {
  //console.log(`benchNextStep #${bench.step}...`);

  const step = test.states[bench.step];
  if (!step) {
    return;// void console.error(`benchNextStep could not find step ${bench.step}`);
  }
  
  // verify
  if (step.verify && step.verify.length > 0) {
    // resume verify if it last failed
    for (let i = bench.resumeVerifyIndex || 0; i < step.verify.length; i++) {
      const verify = step.verify[i];
      const elType = verify.match[0]; // first character is the type (#, .)
      const elName = verify.match.substr(1);
      const els = elType === '.' ? document.getElementsByClassName(elName) : [document.getElementById(elName)];
      if (!els || !els.length || !els[0]) {
        if (bench.resumeVerifyIndex === null) console.warn(`Unable to verify ${step.onComplete}, step ${bench.step}, match not found for ${verify.match}. Will keep trying until satisified`);
        bench.resumeVerifyIndex = i;
        return void setImmediate(benchNextStep); // try again later, but not as aggressive as setImmediate
      }

      for (let eli = 0; eli < els.length; eli++) {
        if (!verify.test(els[eli])) {
          //if (bench.resumeVerifyIndex === null) console.warn(`Unable to verify ${step.onComplete}, step ${bench.step}. Will keep trying until satisified`);
          bench.resumeVerifyIndex = i;
          return void setImmediate(benchNextStep); // try again later, but not as aggressive as setImmediate
        }
      }
    }
  }

  bench.resumeVerifyIndex = null;

  bench.step++;
  if (bench.step === test.states.length) {
    bench.running = false;
    benchMark('COMPLETE');
    return;
  }

  setImmediate(test.dispatch.bind(window.test, { type: step.onComplete, step: bench.step - 1 }));
  setImmediate(benchNextStep);
}

// main
(() => {

  monitorFramerate();

})();

function monitorFramerate() {
  const { fps } = bench;

  const cb = () => {
    const now = performance.now();

    fps.frames.push({
      time: now,
      duration: Math.max(now - fps.lastTick, MAX_FRAME_MSEC)
    });

    fps.lastTick = now;

    if (!bench.running || fps.frames.length > MAX_FRAMES) return;

    // check again next frame
    requestAnimationFrame(cb);
  };

  requestAnimationFrame(cb, 0);
}