import fetch from '@/utils/fetch'

export function createChart(data) {
  return fetch({
    url: '/chart/create',
    method: 'POST',
    data
  })
}

export function updateChart(data) {
  return fetch({
    url: '/chart/update',
    method: 'POST',
    data
  })
}

export function getChartById(id) {
  return fetch({
    url: `/chart/${id}`
  })
}

export function deleteChart(data) {
  return fetch({
    url: `/chart/delete`,
    method: 'POST',
    data
  })
}

export function chartList() {
  return fetch({
    url: `/chart/list`
  })
}
