/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi:
      'https://www.fastmock.site/mock/9422af4d6568bf4f2584c09a1b9820b6/api',
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/9422af4d6568bf4f2584c09a1b9820b6/api',
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/9422af4d6568bf4f2584c09a1b9820b6/api',
  },
}
export default {
  env,
  mock: false,
  namespace: 'manager',
  ...EnvConfig[env],
}
