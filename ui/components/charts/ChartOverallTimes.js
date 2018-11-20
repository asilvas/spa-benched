import React, { useEffect } from 'react';
import Chartist from 'chartist';
import benchData from '../../../webpack/bench-data.json';
import chartistTooltip from 'chartist-plugin-tooltips-updated';

export default ({ results }) => {
  useEffect(() => {
    const series = benchData.tests.map(t => {
      // each row is one test
      return results
        .filter(result => result.test.name === t.name)
        .sort((a, b) => a.app.name < b.app.name ? -1 : 1)
        .map(result => ({
          meta: `App: ${result.app.name}, Test: ${result.test.name}`,
          value: result.bench.marks['COMPLETE'].time / 1000
        })
      );
    });

    const chartData = {
      labels: benchData.apps.map(t => t.name).sort(), // alpha
      series
    };

    const chart = new Chartist.Bar('#chartOverallTimes', chartData, {
      height: `${benchData.apps.length * benchData.tests.length * 28}px`,
      stackBars: false,
      seriesBarDistance: 20,
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
          style: 'stroke-width: 20px'
        });
      }
    });

    return () => {
      chart.detach();
    }
  }, [results]);

  return (<>
    <h5>Overall Times (Lower the better)</h5>
    <div id="chartOverallTimes" className="ct-chart"></div>
  </>);
};
