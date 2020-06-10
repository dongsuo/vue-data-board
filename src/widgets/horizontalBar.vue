<template>
  <div ref="chart" :style="chartStyle" />
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
      // console.log(this.$refs.chart)
      if (!this.$refs.chart) return
      if (data.length === 0 && this.chart) {
        this.chart.clear()
        this.chart.setOption({
          graphic: [{
            type: 'group',
            left: 'center',
            top: 'center',
            children: [
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: 'middle',
                style: {
                  fill: '#333',
                  text: this.noDataDesc,
                  font: '14px Microsoft YaHei'
                }
              }
            ]
          }]
        })
        return
      }
      let legend = []
      let yAxisData = []
      const seriesObj = {}
      if (this.schema.filter(schema => schema.asxAxis).length === 2) {
        const dimensions = this.schema.filter(schema => schema.asxAxis)
        const xAxisName = dimensions[0].name
        const legendName = dimensions[1].name
        const valueName = this.schema.find(schema => !schema.asxAxis).name
        yAxisData = this.data.map(item => {
          legend.push(item[legendName])
          return item[xAxisName]
        })
        yAxisData = Array.from(new Set(yAxisData))
        legend = Array.from(new Set(legend))
        legend = legend.map((legendItem, index) => {
          const seriesData = yAxisData.map(xAxisValue => {
            const item = data.find(dataItem => dataItem[legendName] === legendItem && dataItem[xAxisName] === xAxisValue)
            if (item) {
              return item[valueName]
            } else {
              return '-'
            }
          })
          legendItem += ''
          seriesObj[legendItem] = {
            name: legendItem,
            data: seriesData,
            type: 'bar'
          }
          return legendItem
        })
      } else {
        this.schema.forEach((schema, index) => {
          legend.push(schema.label || schema.name)
          if (!schema.asxAxis) {
            seriesObj[schema.name] = {
              name: schema.label || schema.name,
              data: [],
              // showSymbol: false,
              type: 'bar'
            }
          }
          data.forEach(item => {
            if (schema.asxAxis) {
              yAxisData.push(item[schema.name])
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
          feature: {
            saveAsImage: {
              show: true
            },
            restore: {
              show: true
            },
            dataZoom: {
              show: false
            }
          }
        },
        grid: {
          top: '10%',
          left: '80px',
          bottom: '10%',
          right: '20px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'value',
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
          type: 'category',
          data: yAxisData,
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
