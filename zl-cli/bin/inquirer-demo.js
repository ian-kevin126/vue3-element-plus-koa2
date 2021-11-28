/**
 * inquirer：命令行输入交互
 */
// 自定义脚手架：https://juejin.cn/post/6966119324478079007#heading-0

const { program } = require('commander')
const inquirer = require('inquirer')

// 指定cli版本
program.version('0.0.1')

// 自定义指令
program.option('-n', '输出名称')
program.option('-t --type <type>', '项目类型')

// 做人机交互的指令，多选的时候要用空格去确认选择
inquirer
  .prompt([
    {
      name: 'userName',
      type: 'input',
      message: '你的名字叫什么？',
    },
    {
      name: 'age',
      type: 'checkbox',
      message: '你多大了？',
      choices: ['20-25', '26-30', '31-40'],
    },
  ])
  .then((answer) => {
    console.log('回答内容', answer)
  })

program.parse(process.argv)
