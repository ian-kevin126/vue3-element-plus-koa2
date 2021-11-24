import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    redirect: '/welcome',
    // meta可以配置一些跳转过程中更改页面标题，角色权限等
    meta: {
      title: '首页',
    },
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        component: Welcome,
      },
      {
        name: 'login',
        path: '/login',
        component: Login,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
