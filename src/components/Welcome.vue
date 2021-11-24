<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'

defineProps({
  msg: String
})

const count = ref(0)
const router = useRouter();
const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div>
    welcome
  </div>
  <el-button @click="goLogin">去登录</el-button>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
