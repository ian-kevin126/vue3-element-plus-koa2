/**
 * 用户管理模块
 */

const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./../config')
const md5 = require('md5')

router.prefix('/users')

router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    /**
     * 返回数据库指定字段，有三种方式
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId:1,_id:0}
     * 3. select('userId')
     */
    const res = await User.findOne(
      {
        userName,
        // userPwd: md5(userPwd),
        userPwd: userPwd,
      }
      // 'userId userName userEmail state role deptId roleList'
    )

    console.log('res', res)
    console.log('res._doc', res._doc)

    if (res) {
      const data = res._doc

      // 对返回的信息进行加密，生成token
      const token = jwt.sign(
        {
          data,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      console.log('token', token)

      // 将token保存在用户信息中
      data.token = token
      ctx.body = util.success(data)
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

module.exports = router
