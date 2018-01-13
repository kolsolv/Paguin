const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './demo/src/index.js',

  output: {
    path: path.resolve(__dirname + '/demo', 'dist'),
    filename: 'bundle.js'
  },

  resolve: {
    symlinks: false,
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }

};
