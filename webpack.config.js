const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = {
  alias: {
    '@events': `${__dirname}/src/events`,
    '@client': `${__dirname}/src/client`,
    '@server': `${__dirname}/src/server`,
    '@css': `${__dirname}/assets/css`,
  }
};

const clientConfig = env => ({
  target: 'web',
  entry: './src/client/index.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, env.root || '.', 'build'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(svg|ttf|woff|png)$/,
        type: 'asset/resource'
      },
    ]
  },
  resolve,
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new DefinePlugin({
      ICE_SERVERS: env.iceServers || '{}',
    }),
  ]
});

const serverConfig = env => ({
  target: 'node',
  entry: './src/server/index.js',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, env.root || '.', 'bin'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[ '@babel/preset-env', { targets: { node: true } } ]],
          }
        }
      }
    ]
  },
  resolve,
});

module.exports = env => [ serverConfig(env), clientConfig(env) ];
