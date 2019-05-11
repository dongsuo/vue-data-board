<template>
  <div>
    <el-card :style="cardStyle">
      <el-table :data="data" height="500px" highlight-current-row border stripe class="data-table">
        <el-table-column v-for="item in schema" :key="item.Column" :prop="item.Column" :label="item.Column" align="center" />
      </el-table>
    </el-card>
  </div>
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
    cardStyle: {
      require: false,
      type: Object,
      default: () => {
        return {
          height: '100%',
          width: '100%'
        }
      }
    }
  }
}
</script>
