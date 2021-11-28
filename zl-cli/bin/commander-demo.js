// 自定义脚手架：https://juejin.cn/post/6966119324478079007#heading-0

const { program } = require('commander')

// 指定cli版本
program.version('0.0.1')

// 自定义指令
program.option('-n', '输出名称')
program.option('-t --type <type>', '项目类型')

program.parse(process.argv)

const options = program.opts()

console.log('opts =>', options)

program
  .command('create <app-name>')
  .description('创建一个标准的Vue项目')
  .action((name) => {
    console.log('正在创建Vue项目，名称为：' + name)
  })
