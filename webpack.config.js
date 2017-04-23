/*global __dirname, require, module*/

const nodeExternals = require('webpack-node-externals');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'react-redux-lite';

let plugins = [], outputFile, entryFile, outputDir;
if (env === 'test') {
  entryFile = './src/test/index.js';
  outputFile = 'index.js';
  outputDir = 'dist-test';
} else {
  outputDir = 'dist';
  entryFile = './src/index.js';
  outputFile = libraryName + '.js';
}

const config = {
  entry: entryFile,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, outputDir),
    filename: outputFile,
    libraryTarget: 'commonjs',
  },

  target: 'node',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      // },
    ],
  },
  resolve: {
    modules: [path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins: plugins,
};

module.exports = config;
