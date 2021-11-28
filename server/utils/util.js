/**
 * 通用工具函数
 */
const log4js = require('./log4j')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, //账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, //业务请求失败
  AUTH_ERROR: 500001, // 认证失败或TOKEN过期
}
module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum
   * @param {number} pageSize
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    pageNum *= 1
    pageSize *= 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize,
      },
      skipIndex,
    }
  },
  success(data = '', msg = '', code = CODE.SUCCESS) {
    log4js.debug(data)
    return {
      code,
      data,
      msg,
    }
  },
  fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
    log4js.debug(msg)
    return {
      code,
      data,
      msg,
    }
  },
  CODE,
  decoded(authorization) {
    if (authorization) {
      let token = authorization.split(' ')[1]
      return jwt.verify(token, JWT_SECRET)
    }
    return ''
  },
  // 递归拼接树形列表
  getTreeMenu(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i]
      // 这里要注意的是：加一层slice()是为了防止改变原对象，
      // 还有id本身是Buffer类型的，需要转成字符串类型才能比较
      if (String(item.parentId.slice().pop()) == String(id)) {
        // 往库里去push对象的时候，需要通过_doc属性获取文档对象
        list.push(item._doc)
      }
    }
    list.map((item) => {
      item.children = []
      // 递归遍历子菜单
      this.getTreeMenu(rootList, item._id, item.children)
      if (item.children.length == 0) {
        delete item.children
      } else if (item.children.length > 0 && item.children[0].menuType == 2) {
        // 通过action，就可以快速区分按钮和菜单，用于后期做菜单按钮权限控制
        item.action = item.children
      }
    })
    return list
  },
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
      // 'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + ''
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length)
        )
      }
    }
    return fmt
  },
}
