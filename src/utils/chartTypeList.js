import { sqlFunc } from './configs'

function dataTransfer(data, schema) {
  const chartData = data.map(item => {
    const dataItem = {}
    schema.forEach(column => {
      // hasxAxis = hasxAxis || column.asxAxis
      if (column.calculFunc) {
        column.lable = `${column.Column}(${sqlFunc[column.calculFunc]})`
      } else {
        column.lable = `${column.Column}`
      }
      column.name = column.Column
      column.asxAxis = column.isDimension
      dataItem[column.Column] = item[column.Column]
    })
    return dataItem
  })
  return chartData
}

const chartTypeList = [
  { name: '表格',
    icon: 'chart_table',
    type: 'table',
    matchRule: {
      desc: '任意维度和数值',
      isUsable(dimensions, calculs) {
        return true
      }
    },
    componentName: 'DataTable',
    dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          if (column.calculFunc) {
            column.name = `${column.Column}(${sqlFunc[column.calculFunc]})`
          } else {
            column.name = `${column.Column}`
          }
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
  },
  { name: '折线图',
    icon: 'chart_line',
    type: 'line',
    matchRule: {
      desc: '1 或 2个维度;1或多个数值',
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'lineChart', dataTransfer
  },
  { name: '柱状图',
    icon: 'chart_bar',
    type: 'bar',
    matchRule: {
      desc: '1 或 2个维度;1或多个数值',
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'BarChart',
    dataTransfer
  },
  { name: '堆积柱状图',
    icon: 'stack_bar',
    type: 'stackBar',
    matchRule: {
      desc: '1 或 2个维度;2或多个数值',
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 2)
      }
    },
    componentName: 'StackBarChart',
    dataTransfer
  },
  { name: '饼图',
    icon: 'chart_pie',
    type: 'pie',
    matchRule: {
      desc: '1个维度1个数值;0个维度多个数值',
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 && calculs.length === 1) || (dimensions.length === 0 && calculs.length >= 1)
      }
    },
    componentName: 'PieChart',
    dataTransfer
  },
  { name: '条形图',
    icon: 'horizontal_bar',
    type: 'horizontalBar',
    matchRule: {
      desc: '1个维度;1或多个数值',
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'HorizontalBar',
    dataTransfer
  }
]

export default chartTypeList
