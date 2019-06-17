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
      return data
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
    componentName: 'lineChart', dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          // hasxAxis = hasxAxis || column.asxAxis
          column.name = column.Column
          column.lable = column.Column
          column.asxAxis = column.isDimension
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
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
    componentName: 'BarChart', dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          column.name = column.Column
          column.lable = column.Column
          column.asxAxis = column.isDimension
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
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
    componentName: 'StackBarChart', dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          column.name = column.Column
          column.lable = column.Column
          column.asxAxis = column.isDimension
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
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
    componentName: 'PieChart', dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          column.name = column.Column
          column.lable = column.Column
          column.asxAxis = column.isDimension
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
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
    componentName: 'HorizontalBar', dataTransfer(data, schema) {
      const chartData = data.map(item => {
        const dataItem = {}
        schema.forEach(column => {
          column.name = column.Column
          column.lable = column.Column
          column.asxAxis = column.isDimension
          dataItem[column.Column] = item[column.Column]
        })
        return dataItem
      })
      return chartData
    }
  }
]

export default chartTypeList
