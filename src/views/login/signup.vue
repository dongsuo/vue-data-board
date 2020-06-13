<template>
  <div class="container">
    <img src="../../assets/logo.png">
    <!-- <h1>A Data Analysis Board in Vue.</h1> -->
    <el-form class="form-wrapper">
      <el-form-item>
        <el-input v-model="user.email" type="email" :placeholder=" $t('auth.emailPlaceholder')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.userName" type="text" :placeholder=" $t('auth.usernamePlaceholder')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.password" type="password" :placeholder=" $t('auth.passwordPlaceholder')" />
      </el-form-item>
      <el-button :loading="loading" type="primary" @click="handleLogin">
        {{ $t('auth.signIn') }}
      </el-button>
      <el-divider />
      <el-button type="text" size="mini" @click="$router.push('/login')">
        {{ $t('auth.toSignIn') }}
      </el-button>
    </el-form>
  </div>
</template>
<script>
import { signup } from '@/api/user'
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
      signup(this.user).then(resp => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('auth.signUpSuccess')
        })
        this.$router.push('/login')
      }).catch(() => {
        this.loading = false
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
