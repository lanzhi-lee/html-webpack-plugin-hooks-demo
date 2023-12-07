const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlHooksDemoPlugin = require('./webpack-html-plugin')

const { ScmTrackInjectPlugin } = require('@mi/scm-track/webpack')
// const { ScmTrackInjectPlugin } = require('./scm-inject')

/** @type {import('webpack').Configuration} */
module.exports = {
  target: 'web',
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve('./dist/', process.env.subDir || ''),
    publicPath: process.env.publicPath || '',
    filename: 'scripts/main.[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({
      filename: `styles/[name].[contenthash:8].css`,
      chunkFilename: `styles/[name].[contenthash:8].chunk.css`,
    }),
    // new HtmlHooksDemoPlugin(),
    new ScmTrackInjectPlugin({
      injectIifeSDK: true,
      injectOnetrack: true,
    }),
  ],
}
