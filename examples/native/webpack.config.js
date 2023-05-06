const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './static'),
    filename: 'main.js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './static',
    devMiddleware: {
      publicPath: path.resolve(__dirname, '/'),
    },
  },
};