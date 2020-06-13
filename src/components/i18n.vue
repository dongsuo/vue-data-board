<template>
  <el-dropdown class="lang-switch" placement="top" @command="handleCommand">
    <span class="lang-label">{{ langObj.label }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="langItem in langList" :key="langItem.key" :command="langItem.key">
        {{ langItem.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { langList } from '@/lang'

export default {
  data() {
    return {
      langList
    }
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.app.lang
      },
      set(value) {
        this.$store.commit('app/SET_LANG', value)
      }
    },
    langObj() {
      return this.langList.find(item => item.key === this.lang)
    }
  },
  methods: {
    handleCommand(command) {
      this.lang = command
    }
  }
}
</script>

<style lang="scss" scoped>
.lang-switch {
  position: fixed;
  bottom: 100px;
  right: 25px;
  z-index: 99;
  .lang-label {
    display: inline-block;
    text-align: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    line-height: 50px;
    color: #205cd8;
  }
}
</style>
