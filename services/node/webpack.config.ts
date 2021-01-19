import path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';

import { SERVER_PORT, IS_DEV, WEBPACK_PORT } from './src/server/config';

// Make .env environment variables available in process.env in client code
const dotenv = require('dotenv').config({path: __dirname + '/src/client/.env'});
const plugins = [
  new ManifestPlugin(),
  new DefinePlugin({
    "process.env": JSON.stringify(dotenv.parsed)
  })
];

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead';

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: [
    './src/client/client',
  ],
  output: {
    path: path.join(__dirname, 'dist', 'statics'),
    filename: `[name]-[hash:8]-bundle.js`,
    chunkFilename: '[name]-[hash:8]-bundle.js',
    publicPath: '/statics/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimize: !IS_DEV,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        material: {
          test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
          name: 'material-ui',
          chunks: 'all',
          priority: 20,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, nodeModulesPath],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', { modules: false, targets }], '@babel/react', '@babel/typescript'],
            plugins: [
              '@babel/proposal-numeric-separator',
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      // Below added to fix import of chess.js (Needed for jest to work with chess.js)
      {
        test: /chess.js/,
        parser: {
          amd: false,
        },
      }
    ],
  },
  devServer: {
    port: WEBPACK_PORT,
    host: '0.0.0.0',
    overlay: IS_DEV,
    open: IS_DEV,
    openPage: `http://localhost:${SERVER_PORT}`,
  },
  plugins,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};

export default config;
