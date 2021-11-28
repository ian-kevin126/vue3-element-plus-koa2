// figlet：终端打印大型文字

// node自带的promisify可以将一个对象包装成promise对象
const { promisify } = require('util')
const figlet = require('figlet')
const asyncFiglet = promisify(require('figlet'))

figlet('hello world', function (err, data) {
  if (err) {
    console.log('Something went wrong...')
    console.dir(err)
    return
  }
  console.log(data)
})

// node bin/figlet-demo.js 就能看到大字

async function run() {
  let data = await asyncFiglet('Vue 3')
  console.log(data)
}

run()
