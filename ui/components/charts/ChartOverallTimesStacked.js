import React, { useEffect } from 'react';
import Chartist from 'chartist';
import benchData from '../../../webpack/bench-data.json';
import chartistTooltip from 'chartist-plugin-tooltips-updated';

export default ({ results }) => {
  useEffect(() => {
    const appTimes = results.reduce((state, r) => {
      state[r.app.name].totalTime += r.bench.marks['COMPLETE'].time;
      return state;
    }, benchData.apps.reduce((state, app) => { state[app.name] = { totalTime: 0 }; return state; }, {}));

    const series = benchData.tests.map(t => {
      // each row is one test
      return results
        .filter(result => result.test.name === t.name)
        .sort((a, b) => a.app.name === b.app.name ? 0 : appTimes[a.app.name].totalTime < appTimes[b.app.name].totalTime ? -1 : 1) // SLOWEST FIRST
        .map(result => ({
          meta: `App: ${result.app.name}, Test: ${result.test.name}`, value: result.bench.marks['COMPLETE'].time / 1000
        })
      );
    });

    const chartData = {
      labels: benchData.apps.sort((a, b) => appTimes[a.name].totalTime < appTimes[b.name].totalTime ? -1 : 1).map(a => a.name), // SLOWEST FIRST
      series
    };

    const chart = new Chartist.Bar('#chartOverallTimesStacked', chartData, {
      height: `${benchData.apps.length * 50}px`,
      stackBars: true,
      seriesBarDistance: 5,
      reverseData: false,
      horizontalBars: true,
      axisY: {
        offset: 120
      },
      plugins: [
        chartistTooltip({ anchorToPoint: true, appendToBody: true })
      ]
    }).on('draw', data => {
      if(data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 30px'
        });
      }
    });

    return () => {
      chart.detach();
    }
  }, [results]);

  return (<>
    <h5>Overall Times (Lower the better)</h5>
    <div id="chartOverallTimesStacked" className="ct-chart"></div>
  </>);
};
