<template>
  <div id="app">
    <ChartPanel msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import ChartPanel from './views/ChartPanel'

export default {
  name: 'App',
  components: {
    ChartPanel
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
</style>
