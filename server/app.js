const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const users = require('./routes/users')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const { JWT_SECRET } = require('./config')

// error handler
onerror(app)

// 连接数据库
require('./config/db')

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

// logger
app.use(async (ctx, next) => {
  // const start = new Date()
  // await next()
  // const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)

  // 在服务端调试后台打印前端的入参数据，方便调试和排查错误
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    if (err.status == '401') {
      ctx.status = 200
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
})

app.use(
  koajwt({ secret: JWT_SECRET }).unless({
    path: [/^\/api\/users\/login/],
  })
)

// 一级路由，定义路由前缀，匹配前端的请求
router.prefix('/api')

// 加载二级路由
router.use(users.routes(), users.allowedMethods())

// 加载全局路由，注意这一步也不可以漏写
app.use(router.routes(), router.allowedMethods())

// error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
})

module.exports = app
