const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlHooksDemoPlugin = require('./webpack-html-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  target: 'web',
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin(), new HtmlHooksDemoPlugin()],
}
