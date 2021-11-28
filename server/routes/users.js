/**
 * 用户管理模块
 */

const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, EXPIRES_IN } = require('./../config')
const Counter = require('./../models/counterSchema')
const Menu = require('./../models/menuSchema')
const Role = require('./../models/roleSchema')
const md5 = require('md5')

router.prefix('/users')

/**
 * 用户登录
 */
router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    /**
     * 返回数据库指定字段，有三种方式
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId:1,_id:0}，1代表返回，0代表不返回
     * 3. findOne().select('userId')
     */
    const res = await User.findOne(
      {
        userName,
        // userPwd: md5(userPwd),
        userPwd: userPwd,
      },
      // 指定返回的字段
      'userId userName userEmail state role deptId roleList'
    )

    if (res) {
      const data = res._doc

      // koa-jwt 是负责对 token 进行验证的，
      // 而 jsonwebtoken 是负责生成 token 的，所以接下来看我们如何进行 token 的生成
      const token = jwt.sign(
        {
          data,
        },
        JWT_SECRET,
        { expiresIn: EXPIRES_IN }
      )
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

/**
 * 获取用户列表
 */
router.get('/list', async (ctx) => {
  const { userId, userName, state } = ctx.request.query
  // 通过utils里封装的分页参数方法，生成分页参数
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  // state为0的时候表示所有，就不需要传参了
  if (state && state != '0') params.state = state
  try {
    // 根据条件查询所有用户列表
    // find第二个参数：过滤掉一些不需要返回的字段，比如_id和密码
    const query = User.find(params, { _id: 0, userPwd: 0 })
    // 分页处理
    const list = await query.skip(skipIndex).limit(page.pageSize)
    // 获取总的数据条数
    const total = await User.countDocuments(params)

    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常:${error.stack}`)
  }
})

/**
 * 获取全量用户列表
 */
router.get('/all/list', async (ctx) => {
  try {
    const list = await User.find({}, 'userId userName userEmail')
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

/**
 * 用户删除/批量删除
 */
router.post('/delete', async (ctx) => {
  // 待删除的用户Id数组
  const { userIds } = ctx.request.body
  // User.updateMany({ $or: [{ userId: 10001 }, { userId: 10002 }] })
  // 将用户的 state 改为2就是软删除，并不是真正从数据库中删除
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 })
  if (res.nModified) {
    ctx.body = util.success(res, `共删除成功${res.nModified}条`)
    return
  }
  ctx.body = util.fail('删除失败')
})

/**
 * 用户新增/编辑
 */
router.post('/operate', async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body
  if (action == 'add') {
    // 新增功能，需要注意的是 MongoDB不同于MySQL可以自己创建自增长的id，在MongoDB里面，我们需要
    // 手动去维护一个自增长的id的表，首先要在数据库自己先创建一个表 counter，作为自增id表
    /**
     * {
          "_id" : "userId",
          "sequence_value" : 1000001
      }
     * 下次，就会先去这个表查询对应的id，然后+1，作为新增用户的id，当然我们也可以每次在新增的时候，
      在User表里面去查找id最后一位，然后+1，作为新用户的id，这样显然是非常耗费性能的。相比之下，我们
      维护一个单表counters，显然是性能更好的。
     */

    // 参数校验
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
      return
    }

    // 去重处理，如果输入的用户名和邮箱已经被用过了，那就返回重名提醒。
    const res = await User.findOne(
      { $or: [{ userName }, { userEmail }] },
      '_id userName userEmail'
    )
    if (res) {
      ctx.body = util.fail(
        `系统监测到有重复的用户，信息如下：${res.userName} - ${res.userEmail}`
      )
    } else {
      // 校验通过后，先去id自增表里面查询一个叫userId的id，然后将其+1，实现自增
      // 这里有个注意的地方是，应将id自增放到所有校验通过之后的这个位置，避免很多不必要的id自增
      const doc = await Counter.findOneAndUpdate(
        { _id: 'userId' },
        // 通过$inc实现自增 + 1
        { $inc: { sequence_value: 1 } },
        // 设置为new，返回一个新的document
        { new: true }
      )

      try {
        // 可以通过 User.create() 或者 new User 方式去创建
        const user = new User({
          userId: doc.sequence_value,
          userName,
          // 对用户密码进行加密
          userPwd: md5('123456'),
          userEmail,
          role: 1, // 创建的时候，默认是普通用户
          roleList,
          job,
          state,
          deptId,
          mobile,
        })
        user.save()
        ctx.body = util.success('', '用户创建成功')
      } catch (error) {
        ctx.body = util.fail(error.stack, '用户创建失败')
      }
    }
  } else {
    // 编辑的时候部门不能为空
    if (!deptId) {
      ctx.body = util.fail('部门不能为空', util.CODE.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate(
        { userId },
        { mobile, job, state, roleList, deptId }
      )
      ctx.body = util.success({}, '更新成功')
    } catch (error) {
      ctx.body = util.fail(error.stack, '更新失败')
    }
  }
})

/**
 * 获取用户对应的权限菜单
 */
router.get('/getPermissionList', async (ctx) => {
  let authorization = ctx.request.headers.authorization
  // 解析token，获取权限数据
  let { data } = util.decoded(authorization)

  // 通过角色（role）和角色权限列表（roleList）去获取菜单列表
  let menuList = await getMenuList(data.role, data.roleList)
  // 对拿到的菜单列表进行递归，拼装成我们需要的树形结构数据
  let actionList = getAction(JSON.parse(JSON.stringify(menuList)))
  ctx.body = util.success({ menuList, actionList })
})

/**
 * 获取全量的菜单数据
 * @param {*} userRole
 * @param {*} roleKeys
 * @returns
 */
async function getMenuList(userRole, roleKeys) {
  let rootList = []
  // 0是管理员
  if (userRole == 0) {
    rootList = (await Menu.find({})) || []
  } else {
    // 根据用户拥有的角色，获取权限列表，也就是去roles表里查询角色对应的permissionList
    // 现查找用户对应的角色有哪些
    let roleList = await Role.find({ _id: { $in: roleKeys } })
    let permissionList = []
    roleList.map((role) => {
      let { checkedKeys, halfCheckedKeys } = role.permissionList
      permissionList = permissionList.concat([
        ...checkedKeys,
        ...halfCheckedKeys,
      ])
    })

    // 先对对权限列表做一个去重，因为用户可能有多个角色，有些角色的权限是相同的，需要去重。
    permissionList = [...new Set(permissionList)]
    // 去菜单表menus里面查询key对应的菜单列表，最后在通过getTreeMenu拼装成前端需要的树形结构
    rootList = await Menu.find({ _id: { $in: permissionList } })
  }
  return util.getTreeMenu(rootList, null, [])
}

function getAction(list) {
  let actionList = []
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.action) {
        item.action.map((action) => {
          actionList.push(action.menuCode)
        })
      }
      if (item.children && !item.action) {
        deep(item.children)
      }
    }
  }
  deep(list)
  return actionList
}

module.exports = router
