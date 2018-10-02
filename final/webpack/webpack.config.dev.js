const path = require('path');
const webpack = require('webpack');
const postcssinlinesvg = require('postcss-inline-svg');
const postcsscssnext = require('postcss-cssnext')();

require('autoprefixer');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.resolve(__dirname, '../src'),
  ],
  output: {
    path: path.resolve(__dirname, '../src'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.json', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        APP_NAME: JSON.stringify(process.env.APP_NAME),
        WEBPACK: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postcsscssnext,
                postcssinlinesvg({ path: path.resolve(__dirname, '../src/assets') }),
              ],
            },
          },
        ],
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  postcsscssnext,
                  postcssinlinesvg({ path: path.resolve(__dirname, '../src/assets') }),
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules'),
              ],
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
};
