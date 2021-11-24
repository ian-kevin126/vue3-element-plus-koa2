/**
 * axios二次封装
 */
import axios from 'axios'
import config from './../config'
import { ElMessage } from 'element-plus'
import router from './../router'
import storage from './storage'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
})

// 请求拦截，主要是给请求头塞入token，以及处理一些请求的参数处理：比如时间戳转换成日期等等
service.interceptors.request.use((req) => {
  const headers = req.headers
  const { token = '' } = storage.getItem('userInfo') || {}
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
  return req
})

// 响应拦截，主要是对接口请求回来的数据做一些处理
service.interceptors.response.use((res) => {
  // 这里的code是接口本身返回的状态码，和res同级的是http的状态码
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 500001) {
    // token失效，code码需要跟后端进行沟通确认
    ElMessage.error(TOKEN_INVALID)
    // 体验优化：1.5s后再返回登录页，否则用户都没法看到是什么问题
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    // 一定记得return
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  options.method = options.method || 'get'

  // axios中post请求传参是data，get请求是params，我们可以抹平它，提升开发体验
  // axios({
  //   method: 'get',
  //   url: '/user/12345',
  //   params: {
  //     firstName: 'Fred',
  //     lastName: 'Flintstone'
  //   }
  // });

  // axios({
  //   method: 'post',
  //   url: '/user/12345',
  //   data: {
  //     firstName: 'Fred',
  //     lastName: 'Flintstone'
  //   }
  // });

  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  // 是否是mock请求
  let isMock = config.mock

  // api/index.js 中的局部mock优先级最高，如果mock为true，那就是mock数据，
  // 为false的时候，再去看全局的config/index.js里面的mock是否为true
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }
  if (config.env === 'prod') {
    // 对生成环境做一层保险，以防止请求到mock Api
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options)
}

/**
 * 调用方式
 *  login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    noticeCount(params) {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
            mock: false
        })
    },
 * 
 */

// 支持 this.$request.get('/getUserInfo', {name: 'kevin'}).then() 这种方式去调用接口
;['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    })
  }
})

export default request
