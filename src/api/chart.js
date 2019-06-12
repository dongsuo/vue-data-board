import fetch from '@/utils/fetch'

export function createChart(data) {
  return fetch({
    url: '/chart',
    method: 'POST',
    data
  })
}

export function updateChart(data) {
  return fetch({
    url: '/chart',
    method: 'PUT',
    data
  })
}

export function getChartById(id) {
  return fetch({
    url: `/chart?id=${id}`
  })
}

export function deleteChart(data) {
  return fetch({
    url: `/chart`,
    method: 'DELETE',
    data
  })
}

export function chartList() {
  return fetch({
    url: `/chart/list`
  })
}
