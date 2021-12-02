const HtmlWebpackPlugin = require('html-webpack-plugin')

const pluginName = 'HtmlHooksDemoPlugin'

class HtmlHooksDemoPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(pluginName, (data, cb) => {
        cb(null, data)
      })
    })
  }
}

module.exports = HtmlHooksDemoPlugin
