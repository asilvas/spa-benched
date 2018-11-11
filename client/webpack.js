const path = require('path');
const fs = require('fs');

let entries = [
  {
    entry: {
      app: path.resolve(__dirname, 'app.js'),
      bench: path.resolve(__dirname, 'bench.js')
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

const testDirRoot = path.join(__dirname, '../tests');
const testDirs = fs.readdirSync(testDirRoot, { withFileTypes: true });
entries = entries.concat(testDirs.filter(dir => dir.isDirectory).map(dir => {
  const entryPath = path.join(testDirRoot, dir.name, 'test.js');
  const outputPath = path.resolve(__dirname, `../dist/tests/${dir.name}`);
  console.log('test:', entryPath, outputPath);
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

module.exports = entries;
