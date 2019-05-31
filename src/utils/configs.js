export const sqlFunc = {
  sum: '合计',
  avg: '平均',
  max: '最大值',
  min: '最小值',
  count: '计数',
  none: '无'
}

export const filterOperator = [
  { operator: '=', name: '等于', paramNum: 1 },
  { operator: '>', name: '大于', paramNum: 1 },
  { operator: '<', name: '小于', paramNum: 1 },
  { operator: '>=', name: '大于等于', paramNum: 1 },
  { operator: '<=', name: '小于等于', paramNum: 1 },
  { operator: '!=', name: '不等于', paramNum: 1 },
  { operator: 'BETWEEN', name: '区间', paramNum: 2 },
  { operator: 'in', name: 'In', paramNum: -1 },
  { operator: 'like', name: ' 匹配', paramNum: 1 }
]

export const dataType = [
  { name: 'tinyint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'smallint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'mediumint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'int', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'bigint', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'float', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'double', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'real', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'decimal', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] },
  { name: 'timestamp', needQuotation: false, availableFunc: ['count', 'none'] },
  { name: 'date', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'time', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'datetime', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'year', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'char', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'varchar', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'tinytext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'text', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'mediumtext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'longtext', needQuotation: true, availableFunc: ['count', 'none'] },
  { name: 'integer', needQuotation: false, availableFunc: ['sum', 'avg', 'max', 'min', 'count', 'none'] }
]

export const chartTypeList = [
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
        return true
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
        return true
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
        return true
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
    } }
]
