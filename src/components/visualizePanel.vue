<template>
  <div class="pane-container">
    <component :is="currentType.componentName" :data="chartData" :schema="schema" :chart-style="chartStyle" class="visualize-window" />
    <div v-if="isEditMode" class="chart-style-panel">
      <el-form label-position="top">
        <el-form-item label="图表类型">
          <div class="chart-type-list">
            <span v-for="item in chartTypeList" :key="item.type" @click="switchChartType(item)">
              <svg-icon :icon-class="item.icon" />
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import lineChart from '@/widgets/lineChart'
import DataTable from '@/widgets/DataTable'
import BarChart from '@/widgets/BarChart'
import StackBarChart from '@/widgets/StackBarChart'
import PieChart from '@/widgets/PieChart'

import { chartTypeList } from '@/utils/configs'
export default {
  components: { lineChart, DataTable, BarChart, StackBarChart, PieChart },
  props: {
    data: {
      type: Array,
      required: true
    },
    schema: {
      type: Array,
      required: true
    },
    chartStyle: {
      require: false,
      type: Object
    },
    chartType: {
      type: String,
      default: 'table'
    },
    isEditMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chartTypeList,
      currentType: {}
    }
  },
  computed: {
    chartData() {
      return this.currentType.dataTransfer ? this.currentType.dataTransfer(this.data, this.schema) : this.data
    }
  },
  mounted() {
    this.currentType = chartTypeList.find(item => item.type === this.chartType)
  },
  methods: {
    switchChartType(chart) {
      this.$emit('update:chartType', chart.type)
      this.currentType = chart
    }
  }
}
</script>
 <style lang="scss" scoped>
 .pane-container {
   display: flex;
   height: 100%;
   .visualize-window {
     width: 100%;
   }
   .chart-style-panel {
     width: 250px;
     padding: 10px;
     .chart-type-list {
       width: 100%;
       display: grid;
       justify-items: center;
       grid-template-columns: repeat(4, 1fr);
       grid-gap: 10px;
       span {
         font-size: 22px;
         cursor: pointer;
         text-align: center;
         grid-template-columns: 1fr;
         width: 100%;
       }
     }
   }
 }
 </style>
