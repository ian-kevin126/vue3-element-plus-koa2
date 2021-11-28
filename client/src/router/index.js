import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import storage from '../utils/storage'
import API from '../api'
import utils from '../utils/utils.js'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页',
    },
    redirect: '/welcome',
    component: Home,
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎使用系统',
        },
        component: () => import('@/views/Welcome.vue'),
      },
      /*
      {
        name: 'user',
        path: '/system/user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/User.vue'),
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理'
        },
        component: () => import('@/views/Menu.vue'),
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/views/Role.vue'),
      },
      {
        name: 'dept',
        path: '/system/dept',
        meta: {
          title: '部门管理'
        },
        component: () => import('@/views/Dept.vue'),
      } */
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
  {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在',
    },
    component: () => import('@/views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 动态路由
async function loadAsyncRoutes() {
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map((route) => {
        let url = `./../views/${route.component}.vue`
        // 这里要注意：由于比特的问题，目前需要加一个/* @vite-ignore */以防止动态加载组件失败
        route.component = () => import(/* @vite-ignore */ url)
        router.addRoute('home', route)
      })
    } catch (error) {}
  }
}

await loadAsyncRoutes()

// function checkPermission(path) {
//   return router.getRoutes().filter(route => route.path == path).length > 0
// }

// 导航守卫
router.beforeEach(async (to, from, next) => {
  if (to.name) {
    if (router.hasRoute(to.name)) {
      document.title = to.meta.title
      next()
    } else {
      next('/404')
    }
  } else {
    await loadAsyncRoutes()
    let curRoute = router.getRoutes().filter((item) => item.path == to.path)
    if (curRoute?.length) {
      document.title = curRoute[0].meta.title
      next({ ...to, replace: true })
    } else {
      next('/404')
    }
  }
})

export default router
