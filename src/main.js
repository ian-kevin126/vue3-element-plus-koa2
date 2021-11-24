import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// 分环境处理
// Vue3+vite控制台不显示devtools的解决办法：https://segmentfault.com/a/1190000038377431
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'dev') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
    // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
  }
  // app.config.devtools = true
}

console.log('环境变量', import.meta.env)
// 全局引入element-plus
app.use(ElementPlus)
app.use(router).mount('#app')
