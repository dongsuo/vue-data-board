<template>
  <div ref="chart" :style="chartStyle" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import { labelFormatter } from './chartUtils'

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
      let legend = []
      const xAxisData = []
      const seriesObj = {}
      const dimensions = this.schema.filter(schema => schema.asxAxis)
      const dataSchema = this.schema.filter(schema => !schema.asxAxis)[0]
      if (dimensions.length === 2) {
        legend = Array.from(new Set(data.map(item => item[dimensions[1].name])))
        legend.forEach(item => {
          seriesObj[item] = {
            name: item,
            data: [],
            // showSymbol: false,
            type: 'line'
          }
        })

        data.forEach(item => {
          if (!xAxisData.includes(item[dimensions[0].name])) {
            xAxisData.push(item[dimensions[0].name])
          }
        })
        xAxisData.forEach((xAxis, index) => {
          legend.forEach(item => {
            const dataItem = data.find(d => {
              return d[dimensions[0].name] === xAxis && d[dimensions[1].name] === item
            })
            seriesObj[item].data[index] = dataItem ? dataItem[dataSchema.name] : undefined
          })
        })
      } else {
        this.schema.forEach((schema, index) => {
          legend.push(schema.label || schema.name)
          if (!schema.asxAxis) {
            seriesObj[schema.name] = {
              name: schema.label || schema.name,
              data: [],
              // showSymbol: false,
              type: 'line'
            }
          }
          data.forEach(item => {
            if (schema.asxAxis && !xAxisData.includes(item[schema.name])) {
              xAxisData.push(item[schema.name])
            } else {
              seriesObj[schema.name].data.push(item[schema.name])
            }
          })
        })
      }

      const option = {
        legend: {
          bottom: 0,
          type: 'scroll',
          data: legend
        },
        // color: ['#4097ff'],
        toolbox: {
          show: true,
          itemSize: 12,
          top: 0,
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
