const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = {
  alias: {
    '@events': `${__dirname}/src/events`,
    '@client': `${__dirname}/src/client`,
    '@server': `${__dirname}/src/server`,
    '@css': `${__dirname}/assets/css`,
  }
};

const clientConfig = {
  target: 'web',
  entry: './src/client/index.js',
  output: {
    filename: 'client.js',
    path: `${__dirname}/build`,
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
    new HtmlWebpackPlugin({ template: './index.html' })
  ]
};

const serverConfig = {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    filename: 'server.js',
    path: `${__dirname}/bin`,
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
};

module.exports = [ serverConfig, clientConfig ];
