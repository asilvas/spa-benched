import React, { useEffect } from 'react';
import Chartist from 'chartist';
import chartistTooltip from 'chartist-plugin-tooltips-updated';

const BUCKET_SIZE_RATIO = 0.025;

export default ({ results, app }) => {
  const id = `chartFramesOverTime${app ? app.name : ''}`;
  
  useEffect(() => {
    const labels = [];
    let pc;
    for (let l = 0; l <= 1; l += BUCKET_SIZE_RATIO) {
      pc = Math.round(l * 100);
      labels.push(pc % 5 === 0 ? `${pc}%` : null);
    }

    if (app) {
      results = results.filter(result => result.app.name === app.name);
    }

    const series = results.map(result => {
      const meta = `App: ${result.app.name}, Test: ${result.test.name}`;
      const row = [];
      let bucketFrames = 0;
      let bucketSize = 0;
      let currentBucket = BUCKET_SIZE_RATIO;
      result.bench.frames.forEach((frame, idx) => {
        const frameRatio = idx / result.bench.frames.length;
        if (frameRatio > currentBucket && bucketSize > 0) {
          row.push({ meta, value: bucketFrames / bucketSize }); // calc avg FPS for that time bucket
          bucketFrames = 0;
          bucketSize = 0;
          currentBucket += BUCKET_SIZE_RATIO;
        }

        bucketFrames += (1000 / frame.duration); // calc FPS
        bucketSize++;
      });

      if (bucketSize > 0) {
        row.push({ meta, value: bucketFrames / bucketSize }); // calc avg FPS for that time bucket
      }

      return row;
    });

    const chartData = {
      labels,
      series
    };

    const chart = new Chartist.Line(`#${id}`, chartData, {
      height: '400px',
      fullWidth: true,
      chartPadding: {
        right: 20
      },
      //high: 65,
      showPoint: true,
      axisX: {
        showLabel: true,
        showGrid: false
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
      plugins: [
        chartistTooltip({ anchorToPoint: true, appendToBody: true })
      ]
    }).on('draw', function(data) {
      if(data.type === 'line') {
        data.element.attr({
          style: 'stroke-width: 2px'
        });
      } else if (data.type === 'point') {
        data.element.attr({
          style: 'stroke-width: 8px'
        });
      }
    });

    return () => {
      chart.detach();
    }
  }, [results]);

  return (<>
    <h5>Framerate over time{app ? `: ${app.name}` : ''}</h5>
    <div id={id} className="ct-chart"></div>
  </>);
};
