<template>
  <div class="container">
    <img src="../../assets/logo.png">
    <!-- <h1>A Data Analysis Board in Vue.</h1> -->
    <el-form class="form-wrapper">
      <el-form-item>
        <el-input v-model="user.email" type="email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.userName" type="text" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-button type="primary" @click="handleLogin">
        注册
      </el-button>
    </el-form>
  </div>
</template>
<script>
import { signup } from '@/mock/user'
export default {
  data() {
    return {
      user: {
        userName: undefined,
        password: undefined
      }
    }
  },
  methods: {
    handleLogin() {
      signup(this.user).then(resp => {
        this.$message({
          type: 'success',
          message: '注册成功，请登录'
        })
        this.$router.push('/login')
      })
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
