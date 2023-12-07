import { $ } from 'zx'

// 来自 webpack 的 publicPath 的可能取值
// publicPath: 'auto', // It automatically determines the public path from either `import.meta.url`, `document.currentScript`, `<script />` or `self.location`.
// publicPath: 'https://cdn.example.com/assets/', // CDN（总是 HTTPS 协议）
// publicPath: '//cdn.example.com/assets/', // CDN（协议相同）
// publicPath: '/assets/', // 相对于服务(server-relative)
// publicPath: 'assets/', // 相对于 HTML 页面
// publicPath: '../assets/', // 相对于 HTML 页面
// publicPath: '', // 相对于 HTML 页面（目录相同）

const paths = [
  // // 常规case
  // 'https://cdn.example.com/assets/', // 通过
  // '//cdn.example.com/assets/', // 通过
  // '/assets/', // 通过
  // 'assets/', // 通过
  // '../assets/', // 通过
  'auto', // 不通过

  // '', // 通过

  // // 特殊case
  // 'https://cdn.example.com/assets', // 通过
  // '//fe//////', // 通过
  // '//fe/', // 通过
  // '//fe', // 通过
  // 'fe', // 通过
]

await $`rm -rf dist`

for await (const [index, publicPath] of paths.entries()) {
  process.env.publicPath = publicPath
  process.env.subDir = index

  await $`pnpm webpack && npx prettier --write dist/${index}/index.html --print-width 200`
}
