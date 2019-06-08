import fetch from '@/utils/fetch'

export function addDashboard(data) {
  return fetch({
    url: '/dashboard',
    method: 'POST',
    data
  })
}

export function updateDashboard(data) {
  return fetch({
    url: '/dashboard',
    method: 'PUT',
    data
  })
}

export function getdDashboardById(id) {
  return fetch({
    url: `/dashboard?id=${id}`
  })
}

export function dashboardList() {
  return fetch({
    url: `/dashboard/list`
  })
}

export function addChartToDB(data) {
  return fetch({
    url: '/chartdashmap',
    method: 'POST',
    data
  })
}

export function chartByDashboard(id) {
  return fetch({
    url: `/chartdashmap/chartbydashboard?id=${id}`
  })
}

export function unMapChartDb(data) {
  return fetch({
    url: '/chartdashmap/unmap',
    method: 'POST',
    data
  })
}
