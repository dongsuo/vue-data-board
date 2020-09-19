<template>
  <div id="app">
    <div v-if="username && showNavBar()" class="nav-bar">
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
          {{ $t('common.dashboard') }}
        </el-menu-item>
        <el-menu-item index="/chartpanel/create">
          {{ $t('common.chart') }}
        </el-menu-item>
        <el-menu-item index="/source">
          {{ $t('common.dataSource') }}
        </el-menu-item>
      </el-menu>
      <div class="nav-bar-left">
        <a class="nav-bar-link" target="_blank" href="https://github.com/dongsuo/vue-data-board">
          Github
        </a>
        <a class="nav-bar-link" target="_blank" href="https://docs.vislib.best">
          {{ $t('navbar.document') }}
        </a>
        <el-dropdown class="avatar-container right-menu-item" szie="mini" trigger="hover">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.home') }}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout"> {{ $t('auth.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <i18n />
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/components/i18n'

export default {
  name: 'App',
  components: { i18n },
  computed: {
    ...mapGetters([
      'avatar',
      'username'
    ]),
    defaultActive() {
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
      this.$store.dispatch('user/FedLogOut').then(() => {
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
  align-items: center;
  .nav-bar-left {
      display: flex;
      align-items: center;
  }
  .nav-bar-link {
    display: inline-block;
    padding: 0 22px;
    height: 61px;
    line-height: 61px;
    text-align: center;
    color: rgb(96, 98, 102);
    font-size: 14px;
    &:hover {
      background-color: #ccc;
    }
  }
  .avatar-container {
    align-self: center;
    height: 100%;
    height: 45px;
    width: 45px;
    margin: 0 22px;
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
