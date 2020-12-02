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
      const seriesObj = {}
      const dimensions = this.schema.find(schema => schema.asxAxis)
      const values = this.schema.filter(schema => !schema.asxAxis)
      if (dimensions) {
        const dimensionKey = dimensions.name
        data.forEach(item => {
          const seriesName = item[dimensionKey]
          if (!seriesObj[seriesName]) {
            seriesObj[seriesName] = {
              name: seriesName,
              data: [[item[values[0].name], item[values[1].name]]],
              type: 'scatter'
            }
          } else {
            seriesObj[seriesName].data.push([item[values[0].name], item[values[1].name]])
          }
        })
      } else {
        seriesObj.default = {
          name: '',
          data: [],
          type: 'scatter'
        }
        data.forEach(item => {
          seriesObj.default.data.push([item[values[0].name], item[values[1].name]])
        })
      }

      const option = {
        legend: {
          bottom: 0,
          type: 'scroll'
        },
        color: ['#4097ff'],
        toolbox: {
          show: true,
          top: 0,
          itemSize: 12,
          feature: {
            saveAsImage: {
              show: true
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
          top: '45px',
          left: '45px',
          right: '50px',
          bottom: '45px'
        },
        tooltip: {
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => {
            return `${params.seriesName}: <br />
              ${values[0].name}: ${params.value[0]}<br />
              ${values[1].name}:  ${params.value[1]}`
          }
        },
        xAxis: {
          name: values[0].name,
          axisLabel: {
            color: '#95a4bd'
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
            }
          }
        },
        yAxis: {
          name: values[1].name,
          axisLabel: {
            show: true,
            color: '#95a4bd',
            formatter: labelFormatter
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
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
