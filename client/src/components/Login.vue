<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
defineProps({
  msg: String,
})

const count = ref(0)
const router = useRouter()
const goBack = () => {
  router.push('/welcome')
}
</script>

<template>
  <h1>login啊啊啊</h1>
  <el-button @click="goBack">回首页</el-button>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
