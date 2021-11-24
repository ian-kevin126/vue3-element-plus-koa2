<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  msg: String,
})

const count = ref(0)
const router = useRouter()
const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div>
    welcome
    <el-button @click="goLogin">去登录</el-button>
  </div>
</template>

<style lang="scss"></style>
