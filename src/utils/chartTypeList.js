import i18n from '@/i18n'
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
  { name: i18n.t('chartType.table'),
    icon: 'chart_table',
    type: 'table',
    matchRule: {
      desc: i18n.t('chartType.tableDesc'),
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
  { name: i18n.t('chartType.line'),
    icon: 'chart_line',
    type: 'line',
    matchRule: {
      desc: i18n.t('chartType.lineDesc'),
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'lineChart', dataTransfer
  },
  { name: i18n.t('chartType.bar'),
    icon: 'chart_bar',
    type: 'bar',
    matchRule: {
      desc: i18n.t('chartType.barDesc'),
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'BarChart',
    dataTransfer
  },
  { name: i18n.t('chartType.stackBar'),
    icon: 'stack_bar',
    type: 'stackBar',
    matchRule: {
      desc: i18n.t('chartType.stackBarDesc'),
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 2)
      }
    },
    componentName: 'StackBarChart',
    dataTransfer
  },
  { name: i18n.t('chartType.pie'),
    icon: 'chart_pie',
    type: 'pie',
    matchRule: {
      desc: i18n.t('chartType.pieDesc'),
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 && calculs.length === 1) || (dimensions.length === 0 && calculs.length >= 1)
      }
    },
    componentName: 'PieChart',
    dataTransfer
  },
  { name: i18n.t('chartType.horizontalBar'),
    icon: 'horizontal_bar',
    type: 'horizontalBar',
    matchRule: {
      desc: i18n.t('chartType.horizontalBarDesc'),
      isUsable(dimensions, calculs) {
        return (dimensions.length === 1 || dimensions.length === 2) && (calculs.length >= 1)
      }
    },
    componentName: 'HorizontalBar',
    dataTransfer
  }
]

export default chartTypeList
