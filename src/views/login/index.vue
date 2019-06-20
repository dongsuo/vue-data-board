<template>
  <div class="container">
    <img src="../../assets/logo.png">
    <!-- <h1>A Data Analysis Board in Vue.</h1> -->
    <el-form class="form-wrapper">
      <el-form-item>
        <el-input v-model="user.userName" type="text" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-button :loading="loading" type="primary" @click="handleLogin">
        登录
      </el-button>
      <el-divider />
      <div style="display: flex;">
        <el-button type="text" size="mini" style="text-align:left;" @click="useTestAccount">
          不想注册？点我使用测试账号
        </el-button>
        <el-button type="text" size="mini" style="text-align:right;" @click="$router.push('/signup')">
          没有账号？去注册<i class="el-icon-right" />
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      user: {
        userName: undefined,
        password: undefined
      }
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      login(this.user).then(resp => {
        this.loading = false
        this.$store.dispatch('Login', resp.data.token).then(() => {
          this.$router.push(this.$route.query.redirect || '/')
        })
      }).catch(() => {
        this.loading = false
      })
    },
    useTestAccount() {
      this.user = {
        userName: 'dongsuo',
        password: '123456'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  padding-top: 150px;
}
.form-wrapper {
  width: 350px;
  margin: 0 auto;
  padding-top: 40px;
  .el-button {
    width: 100%;
  }
}
</style>
