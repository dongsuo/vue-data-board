<template>
  <div class="pane-container">
    <component :is="currentType.componentName" :data="chartData" :schema="schema" :chart-style="chartStyle" class="visualize-window" />
    <div v-if="isEditMode" class="chart-style-panel">
      <el-form label-position="top" size="mini">
        <el-form-item :label="$t('chart.chartType')+':'">
          <div class="chart-type-list">
            <span v-for="item in chartTypeList" :key="item.type" :class="{activedIcon :item.type===chartType, disabledIcon: !isUsable(item)}" @click="switchChartType(item)">
              <el-tooltip :content="item.name +': '+item.matchRule.desc" placement="top">
                <svg-icon class="icon" :icon-class="isUsable(item)? item.icon : (item.icon + '_disabled')" />
              </el-tooltip>
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
import HorizontalBar from '@/widgets/horizontalBar'
import PieChart from '@/widgets/PieChart'

import chartTypeList from '@/utils/chartTypeList'

export default {
  components: { lineChart, DataTable, BarChart, StackBarChart, PieChart, HorizontalBar },
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
      chartTypeList
    }
  },
  computed: {
    caculCols() {
      return this.$store.state.chart.caculCols
    },
    dimensions() {
      return this.$store.state.chart.dimensions
    },
    allSelected() {
      return this.dimensions.concat(this.caculCols)
    },
    chartData() {
      return this.currentType.dataTransfer ? this.currentType.dataTransfer(this.data, this.schema) : this.data
    },
    currentType() {
      return chartTypeList.find(item => item.type === this.chartType)
    }
  },
  watch: {
    allSelected: {
      deep: true,
      handler() {
        if (!this.currentType.matchRule.isUsable(this.dimensions, this.caculCols)) {
          this.$emit('update:chartType', 'table')
        }
      }
    }
  },
  methods: {
    isUsable(chart) {
      return chart.matchRule.isUsable(this.dimensions, this.caculCols)
    },
    switchChartType(chart) {
      if (!chart.matchRule.isUsable(this.dimensions, this.caculCols)) {
        return
      }
      this.$emit('update:chartType', chart.type)
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
     width: 200px;
     flex-shrink: 0;
     padding: 10px;
     .chart-type-list {
       width: 100%;
       display: grid;
       justify-items: center;
       grid-template-columns: repeat(5, 1fr);
       grid-auto-rows: 1fr;
       grid-gap: 10px;
       span {
         line-height: initial;
         height: 100%;
         font-size: 22px;
         cursor: pointer;
         text-align: center;
         width: 100%;
         position: relative;
         .icon {
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom:0;
           margin: auto;
         }
       }
       span::before {
          content: '';
          width: 100%;
          padding-bottom: 100%;
          display: block;
        }
        .disabledIcon {
          cursor: not-allowed;
        }
       .activedIcon {
         background: #c9c9c9;
       }
     }
   }
 }
 </style>
