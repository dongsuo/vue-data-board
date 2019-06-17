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
    validateData(data) {
      if (!Array.isArray(data)) {
        this.$message({
          message: '线图的数据格式必须为数组，请检查你的数据格式'
        })
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
      const legend = []
      const yAxisData = []
      const seriesObj = {}
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
      const option = {
        legend: {
          // type: 'scroll',
          data: legend
        },
        // color: ['#4097ff'],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true
            },
            myBarChart: {
              show: true,
              title: '饼图',
              icon: 'path://M27.255467 459.8016A27.2128 27.2128 0 0 0 0 487.005867v508.023466a27.2128 27.2128 0 0 0 27.255467 27.204267H276.138667a27.2128 27.2128 0 0 0 27.264-27.204267V486.997333a27.2128 27.2128 0 0 0-27.264-27.204266H27.255467z m221.627733 508.023467H54.2976V513.988267h194.5856v453.8368zM389.393067 27.195733C389.393067 12.168533 401.578667 0.2304 416.426667 0h249.105066a27.2128 27.2128 0 0 1 27.264 27.204267v967.825066a27.2128 27.2128 0 0 1-27.264 27.204267H416.648533a27.2128 27.2128 0 0 1-27.255466-27.204267V27.204267z m54.2976 27.2128v913.6384h194.5856V54.408533H443.690667z m611.012266 967.594667v0.2304H805.819733a27.2128 27.2128 0 0 1-27.264-27.204267V343.031467a27.2128 27.2128 0 0 1 27.264-27.204267h248.8832a27.2128 27.2128 0 0 1 27.255467 27.204267v651.776a27.2128 27.2128 0 0 1-27.255467 27.204266z m-221.627733-651.776v597.819733h194.5856V370.235733H833.0752z',
              onclick: () => {
                this.renderChart(this.data)
              }
            },
            myPieChart: {
              show: true,
              title: '饼图',
              icon: 'path://M902.573115 538.712435l60.111478 4.035763C946.843521 778.856364 748.861121 963.768529 511.970002 963.768529 262.851599 963.768529 60.231471 761.148401 60.231471 512.029998c0-235.205218 183.526247-433.066625 417.888514-450.473605l4.456739 60.051482C279.535621 136.665992 120.463942 308.145945 120.463942 512.029998c0 215.870351 175.635709 391.50706 391.50606 391.50706 205.329969 0 376.869918-160.216612 390.603113-364.824623zM1023.940004 451.737531v30.116235l-30.176232 1.02394h-450.653595V0L573.286409 0.059996C821.801848 0.601965 1023.940004 203.282089 1023.940004 451.737531z m-61.075422-29.091295C949.434369 231.711423 795.661379 76.735504 603.341648 61.556393v361.088843H962.863582z',
              onclick: () => {
                // console.log(this.data, this.schema, 'hello piechart')
                const nameField = this.schema.find(item => item.asxAxis).name
                const valueField = this.schema.find(item => !item.asxAxis).name
                const pieSeriesData = this.data.map(item => {
                  const obj = {
                    name: item[nameField],
                    value: item[valueField]
                  }
                  return obj
                })
                // console.log(pieSeriesData)
                this.chart.setOption({
                  legend: {
                    show: true,
                    data: pieSeriesData.map(item => item.name),
                    bottom: 0
                  },
                  xAxis: {
                    show: false
                  },
                  yAxis: {
                    show: false,
                    silent: true
                  },
                  tooltip: {
                    trigger: 'item',
                    axisPointer: {
                      type: 'none'
                    }
                  },
                  series: [{
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '47%'],
                    data: pieSeriesData,
                    label: {
                      formatter: '{b}: {d}%'
                    },
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }]
                })
              }
            },
            // magicType: {
            //   show: true,
            //   type: ['bar']
            // },
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
