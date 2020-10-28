<template>
  <div ref="chart" :style="chartStyle" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

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
      if (!this.$refs.chart || !data[0]) return
      const legend = []
      let seriesObj = {}
      if (this.schema.filter(schema => schema.asxAxis).length === 0) {
        seriesObj = {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [],
          tooltip: {
            formatter: (params) => {
              return `${params.name}: ${params.percent}%`
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
        // only one row in data if no dimensions
        data = data[0]
        this.schema.forEach((schema, index) => {
          legend.push(schema.name)
          seriesObj.data[index] = seriesObj.data[index] || {}
          seriesObj.data[index].name = schema.name
          seriesObj.data[index].value = data[schema.name]
        })
      } else {
        seriesObj = {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          data: [],
          tooltip: {
            formatter: (params) => {
              return `${params.name}: ${params.percent}%`
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
        this.schema.forEach((schema, index) => {
          data.forEach((item, dataIndex) => {
            seriesObj.data[dataIndex] = seriesObj.data[dataIndex] || {}
            if (schema.asxAxis) {
              legend.push(item[schema.name])
              seriesObj.data[dataIndex].name = item[schema.name]
            } else {
              seriesObj.data[dataIndex].value = item[schema.name]
            }
          })
        })
      }

      const option = {
        legend: {
          type: 'scroll',
          data: legend,
          bottom: 0
        },
        toolbox: {
          show: true,
          itemSize: 12,
          feature: {
            saveAsImage: {
              show: true
            }
          }
        },
        grid: {
          // show: true,
          top: '10px',
          left: '80px',
          right: '0',
          bottom: '45px'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [seriesObj]
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
