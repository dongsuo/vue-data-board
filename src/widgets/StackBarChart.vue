<template>
  <div>
    <el-card :style="cardStyle">
      <div v-if="widgetMeta" slot="header" style="display:flex;justify-content:space-between;">
        <div style="font-weight:500;color:#409eff;font-size: 13px;">{{ widgetMeta.name }}</div>
        <el-tooltip v-if="widgetMeta.data_desc" :content="widgetMeta.data_desc" class="item" effect="dark" placement="top-end" >
          <div><i class="el-icon-question" style="color:#409eff;cursor:pointer;"/></div>
        </el-tooltip>
      </div>

      <div ref="chart" :style="chartStyle"/>
      <!-- <div :style="chartStyle" style="text-align:center;">Oops，你暂无权限查看该数据，你可前往 功能服务=>权限申请 页面申请所需的权限，如有不满请联系你领导</div> -->
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  props: {
    widgetMeta: {
      required: false,
      type: Object,
      default: () => {}
    },
    data: {
      required: true,
      default: () => {}
    },
    schema: {
      type: Array,
      required: true
    },
    chartOpt: {
      type: Object,
      required: false
    },
    chartStyle: {
      require: false,
      type: Object,
      default: () => {
        return {
          height: '500px'
        }
      }
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
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function(data) {
        this.renderChart(data)
      }
    },
    schema: {
      deep: true,
      handler: function() {
        this.renderChart(this.data)
      }
    }
  },
  mounted() {
    this.renderChart(this.data)
    this.$on('resized', this.handleResize)
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    validateData(data) {
      if (!Array.isArray(data)) {
        this.$message({
          message: '柱状图的数据格式必须为数组，请检查你的数据格式'
        })
      }
    },
    renderChart(data) {
      if (!this.$refs.chart) return
      const legend = []
      const xAxisData = []
      const seriesObj = {}
      this.schema.forEach((schema, index) => {
        legend.push(schema.label || schema.name)
        if (!schema.asxAxis) {
          seriesObj[schema.name] = {
            name: schema.label || schema.name,
            data: [],
            stack: 'All',
            // showSymbol: false,
            type: 'bar'
          }
        }
        data.forEach(item => {
          if (schema.asxAxis) {
            xAxisData.push(item[schema.name])
          } else {
            seriesObj[schema.name].data.push(item[schema.name])
          }
        })
      })
      const option = {
        legend: {
          type: 'scroll',
          data: legend
        },
        // color: ['#4097ff'],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            dataZoom: {
              show: true
            }
          }
        },
        grid: {
          top: '10%',
          left: '80px',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#95a4bd'
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
            }
          },
          data: xAxisData
        },
        yAxis: {
          axisLabel: {
            show: true,
            color: '#95a4bd'
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: Object.values(seriesObj)
      }
      setTimeout(() => {
        if (!this.chart) {
          this.chart = echarts.init(this.$refs.chart, 'macarons')
        }
        this.chart.clear()
        this.chart.setOption(option)
        if (this.chartOpt) {
          this.chart.setOption(this.chartOpt)
        }
      }, 0)
    }
  }
}
</script>
