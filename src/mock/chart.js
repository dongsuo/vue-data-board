
const STORAGE_KEY = 'DB-1'
export function saveChart(obj) {
  const chartList = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  obj.index = chartList.length
  chartList.push(obj)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chartList))
}

export function getChart() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
}

export function getChartById(id) {
  const chartList = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  return chartList.find(chart => +chart.index === +id)
}

export function deleteChart(id) {
  const chartList = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  const index = chartList.findIndex(chart => +chart.index === +id)
  chartList.splice(index, 1)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chartList))
}

export function putChart(obj) {
  const chartList = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  const index = chartList.findIndex(chart => +chart.index === +obj.index)
  chartList.splice(index, 1, obj)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chartList))
}
