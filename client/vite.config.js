import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  plugins: [vue()],
  server: {
    port: 8080,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
})
