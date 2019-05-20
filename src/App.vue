<template>
  <div id="app">
    <el-menu
      :default-active="activeMenu"
      :router="true"
      mode="horizontal"
      background-color="#fff"
      text-color="#606266"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/">
        <img src="./assets/logo.png" style="height: 45px;">
      </el-menu-item>
      <el-menu-item index="/dashboard">
        Dashboard
      </el-menu-item>
      <el-menu-item index="/chartpanel/create">
        Chart Panel
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
    defaultActive() {
      console.log(this.$route.path)
      return this.$route.path
    },
    activeMenu() {
      const { meta, path } = this.$route
      // if set path, the sidebar will highlight the path you set
      return meta.activeMenu || path
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html {
  box-sizing: border-box;
}
*, *:before, *:after{
  box-sizing: inherit;
}
body,div,ul,li {
  margin: 0;
  padding: 0;
}
a,a:hover {
  text-decoration: none;
  color: inherit;
}
</style>
