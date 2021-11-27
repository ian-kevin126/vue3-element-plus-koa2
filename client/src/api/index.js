/**
 * api集中管理
 */

import request from '@/utils/request'
export default {
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  noticeCount(params) {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      mock: false,
    })
  },
  getPermissionList() {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      mock: false,
    })
  },
  getAllUserList() {
    return request({
      url: '/users/all/list',
      method: 'get',
      data: {},
      mock: false,
    })
  },
  userDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      mock: false,
    })
  },

  getDeptList(params) {
    return request({
      url: '/dept/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },
  deptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      mock: false,
    })
  },
  // 角色创建
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  // 查询所有角色列表
  getRoleAllList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  // 查询角色列表（带参数）
  getRoleList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },
  // 更新角色权限
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  getApplyList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },
  leaveOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  leaveApprove(params) {
    return request({
      url: '/leave/approve',
      method: 'post',
      data: params,
      mock: true,
    })
  },
}
