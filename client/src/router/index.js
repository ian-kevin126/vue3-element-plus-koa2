import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/components/Home.vue'),
    redirect: '/welcome',
    // meta可以配置一些跳转过程中更改页面标题、角色权限、面包屑等
    meta: {
      title: '首页',
    },
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页',
        },
        component: () => import('@/views/Welcome.vue'),
      },
      {
        name: 'user',
        path: '/user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/User.vue'),
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
