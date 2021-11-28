// import { createRouter, createWebHashHistory } from 'vue-router'

// const routes = [
//   {
//     name: 'home',
//     path: '/',
//     component: () => import('@/components/Home.vue'),
//     redirect: '/welcome',
//     // meta可以配置一些跳转过程中更改页面标题、角色权限、面包屑等
//     meta: {
//       title: '首页',
//     },
//     children: [
//       {
//         name: 'welcome',
//         path: '/welcome',
//         meta: {
//           title: '欢迎页',
//         },
//         component: () => import('@/views/Welcome.vue'),
//       },
//       {
//         name: 'user',
//         path: '/system/user',
//         meta: {
//           title: '用户管理',
//         },
//         component: () => import('@/views/User.vue'),
//       },
//       {
//         name: 'menu',
//         path: '/system/menu',
//         meta: {
//           title: '菜单管理',
//         },
//         component: () => import('@/views/Menu.vue'),
//       },
//       {
//         name: 'role',
//         path: '/system/role',
//         meta: {
//           title: '角色管理',
//         },
//         component: () => import('@/views/Role.vue'),
//       },
//       {
//         name: 'dept',
//         path: '/system/dept',
//         meta: {
//           title: '部门管理',
//         },
//         component: () => import('@/views/Dept.vue'),
//       },
//     ],
//   },
//   {
//     name: 'login',
//     path: '/login',
//     meta: {
//       title: '登录',
//     },
//     component: () => import('@/views/Login.vue'),
//   },
// ]

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
// })

// export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import storage from './../utils/storage'
import API from './../api'
import utils from './../utils/utils'

const routes = [
  {
    name: 'home',
    path: '/',
    // meta可以配置一些跳转过程中更改页面标题、角色权限、面包屑等
    meta: {
      title: '首页',
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎体验Vue3全栈课程',
        },
        component: () => import('@/views/Welcome.vue'),
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

async function loadAsyncRoutes() {
  let userInfo = storage.getItem('userInfo') || {}
  // 先验证token是否存在，否则就要先登录
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPermissionList()
      console.log('menuList', menuList)
      let routes = utils.generateRoute(menuList)
      console.log('routes', routes)
      routes.map((route) => {
        console.log('route', route)
        let url = `./../views/${route.component.slice(1)}.vue`
        route.component = () => import(url)
        router.addRoute('home', route)
      })
    } catch (error) {}
  }
}

await loadAsyncRoutes()
// 判断当前地址是否可以访问
/*
function checkPermission(path) {
    let hasPermission = router.getRoutes().filter(route => route.path == path).length;
    if (hasPermission) {
        return true;
    } else {
        return false;
    }
}
*/
// 导航守卫
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router
