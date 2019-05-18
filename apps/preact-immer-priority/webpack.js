const path = require('path');

const dirs = __dirname.split(/\/|\\/);
const dirName = dirs[dirs.length - 1];

module.exports = {
  entry: path.resolve(__dirname, 'app.js'),
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, `../../dist/apps/${dirName}`)
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
