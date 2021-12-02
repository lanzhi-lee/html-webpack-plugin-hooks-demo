const HtmlWebpackPlugin = require('html-webpack-plugin')
const chalk = require('chalk')
const { omit } = require('lodash')

const pluginName = 'HtmlHooksDemoPlugin'

const log = (log) => console.log(chalk.yellow(`===== ${log} =====`))

class HtmlHooksDemoPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(pluginName, (data, cb) => {
        log('1. beforeAssetTagGeneration')
        // console.log(omit(data, 'plugin'))
        // NOTE 准备阶段 没啥有用信息
        cb(null, data)
      })
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(pluginName, (data, cb) => {
        log('2. alterAssetTags')
        // console.log(omit(data, ['plugin', 'outputName', 'assetTags']), data.assetTags)
        console.log('data.assetTags.meta', data.assetTags.meta)
        console.log('data.assetTags.scripts', data.assetTags.scripts)
        console.log('data.assetTags.styles', data.assetTags.styles)

        // NOTE 在此阶段存在可操作的 HTML 结构对象
        // 操作对象后，即可在最终生成的标签上注入属性
        data.assetTags.scripts[0].attributes.type = 'text/javascript'
        data.assetTags.scripts[0].attributes.booleanTest = true
        data.assetTags.scripts[0].attributes.dataTest = 1
        data.assetTags.scripts[0].attributes['data-test2'] = 2

        // 也可以直接向对应的数组中传入想要新添加的标签
        data.assetTags.scripts[1] = {
          ...data.assetTags.scripts[0],
          attributes: { ...data.assetTags.scripts[0].attributes, 'data-type': 'self-inject' },
        }

        cb(null, data)
      })
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(pluginName, (data, cb) => {
        log('3. alterAssetTagGroups')
        console.log(omit(data, ['plugin', 'outputName', 'headTags']))

        log('data.headTags: ')
        data.headTags.forEach((tag, index) => {
          console.log(index + 1, '===', tag)
        })

        // NOTE 这一步把上一步中的各类标签对象整合到了 headTags 和 bodyTags 数组中
        // 此时仍可以根据属性名来操作对应的对象
        // 但是因为是在数组里，操作起来感觉不如上一步方便
        data.headTags[3].attributes['data-info'] = 'operated at 3.alterAssetTagGroups'

        cb(null, data)
      })
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(pluginName, (data, cb) => {
        log('4. afterTemplateExecution')
        console.log(omit(data, ['plugin', 'outputName', 'headTags']))

        log('data.headTags: ')
        data.headTags.forEach((tag, index) => {
          console.log(index + 1, '===', tag)
        })

        // NOTE 此阶段生成了一些不完全的HTML字符串
        // 可操作的标签对象仍然存在
        // 仍然可以对标签数组进行操作
        data.headTags[4] = {
          ...data.headTags[3],
          attributes: { ...data.headTags[3].attributes, 'data-type': 'self-inject-css' },
        }

        cb(null, data)
      })
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(pluginName, (data, cb) => {
        log('5. beforeEmit')
        // NOTE HTML输出前
        // 会包含将要输出的文件的 HTML 字符串
        // console.log(omit(data, 'plugin'))
        log(data.html)
        cb(null, data)
      })
      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(pluginName, (data, cb) => {
        log('6. afterEmit')
        console.log(data)
        // NOTE 输出后 就一个文件名，没啥信息
        cb(null, data)
      })
    })
  }
}

module.exports = HtmlHooksDemoPlugin

// beforeAssetTagGeneration
// alterAssetTags
// alterAssetTagGroups
// afterTemplateExecution
// beforeEmit
// afterEmit
