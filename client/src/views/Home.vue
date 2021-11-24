<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div>面包屑</div>
        <div>用户</div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: white;
    overflow-y: auto;
    transition: width 0.6s;
  }

  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
  }
}
</style>
