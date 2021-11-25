<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <!-- 面包屑的首页，可点击 -->
      <router-link to="/welcome" v-if="index == 0">
        {{ item.meta.title }}
      </router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: 'BreadCrumb',
  computed: {
    breadList() {
      console.log('route', this.$route)
      return this.$route.matched
    },
  },
}
</script>
