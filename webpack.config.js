const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = {
  alias: {
    '@events': `${__dirname}/src/events`,
    '@client': `${__dirname}/src/client`,
    '@server': `${__dirname}/src/server`,
    '@css': `${__dirname}/assets/css`,
  }
};

const clientConfig = (env, argv) => ({
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
          options: {
            presets: [
              '@babel/preset-env',
              // Babel 8 picks the dev JSX runtime unless told otherwise
              [ '@babel/preset-react', { development: argv.mode === 'development' } ],
            ],
          }
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
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]',
        },
      },
    ]
  },
  resolve,
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
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
            presets: [[ '@babel/preset-env', { targets: { node: '24' } } ]],
          }
        }
      }
    ]
  },
  resolve,
});

module.exports = (env, argv) => [ serverConfig(env), clientConfig(env, argv) ];
