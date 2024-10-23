const path = require('path');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: '/index.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    // externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ]
    }
};