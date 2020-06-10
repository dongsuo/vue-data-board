<template>
  <div ref="chart" :style="chartStyle" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import { labelFormatter } from './chartUtils'

export default {
  props: {
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
          data: legend,
          bottom: 0
        },
        // color: ['#4097ff'],
        toolbox: {
          show: true,
          top: 0,
          itemSize: 12,
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
          // show: true,
          top: '10px',
          left: '45px',
          right: '0',
          bottom: '45px'
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
            color: '#95a4bd',
            formatter: labelFormatter
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
