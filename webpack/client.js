const path = require('path');
const fs = require('fs');

let entries = [
  {
    entry: {
      ui: path.resolve(__dirname, '../client/ui.js'),
      bench: path.resolve(__dirname, '../client/bench.js')
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, '../dist/client')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
];

const benchState = { apps: [], tests: [] };

const testDirRoot = path.join(__dirname, '../tests');
const testDirs = fs.readdirSync(testDirRoot, { withFileTypes: true });
entries = entries.concat(testDirs.filter(dir => dir.isDirectory && dir.name[0] !== '_').map(dir => {
  const entryPath = path.join(testDirRoot, dir.name, 'test.js');
  const outputPath = path.resolve(__dirname, `../dist/tests/${dir.name}`);
  benchState.tests.push({ name: dir.name });
  return {
    entry: {
      test: entryPath
    },
    output: {
      path: outputPath
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  };
}));

const appDirRoot = path.join(__dirname, '../apps');
const appDirs = fs.readdirSync(appDirRoot, { withFileTypes: true });
appDirs.filter(dir => dir.isDirectory && dir.name[0] !== '_').forEach(dir => {
  benchState.apps.push({ name: dir.name });
});

fs.writeFileSync(path.resolve(__dirname, 'bench-data.json'), JSON.stringify(benchState, null, 2));

module.exports = entries;
