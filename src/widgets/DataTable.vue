<template>
  <el-table :data="data" :style="chartStyle" :height="chartStyle.height" highlight-current-row border stripe class="data-table">
    <el-table-column v-for="item in schema" :key="item.Column" :prop="item.Column" :label="item.Column" align="center" />
  </el-table>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    schema: {
      type: Array,
      default: () => []
    },
    chartStyle: {
      require: false,
      type: Object,
      default: () => {
        return {
          height: '500px'
        }
      }
    }
  }
}
</script>
