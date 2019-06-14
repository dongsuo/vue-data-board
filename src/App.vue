<template>
  <div id="app">
    <div v-if="token && showNavBar()" class="nav-bar">
      <el-menu
        :default-active="activeMenu"
        :router="true"
        mode="horizontal"
        background-color="#fff"
        text-color="#606266"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/">
          <img src="./assets/logo-simple.png" style="height: 45px;">
        </el-menu-item>
        <el-menu-item index="/dashboard">
          仪表盘
        </el-menu-item>
        <el-menu-item index="/chartpanel/create">
          图表
        </el-menu-item>
      </el-menu>
      <el-dropdown class="avatar-container right-menu-item" szie="mini" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'avatar',
      'token'
    ]),
    defaultActive() {
      console.log(this.$route.path)
      return this.$route.path
    },
    activeMenu() {
      const { meta, path } = this.$route
      // if set path, the sidebar will highlight the path you set
      return meta.activeMenu || path
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    showNavBar() {
      return this.$route.path.indexOf('fullscreen') === -1
    }
  }
}
</script>
<style lang="scss">
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
.nav-bar {
  display: flex;
  justify-content: space-between;
  height: 61px;
  border-bottom: 1px solid #EBEEF5;
  .avatar-container {
    align-self: center;
    margin-right: 15px;
    height: 100%;
    height: 45px;
    width: 45px;
    .avatar-wrapper {
      cursor: pointer;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
      .el-icon-caret-bottom {
        color: #409EFF;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
