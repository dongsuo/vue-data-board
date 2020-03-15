import fetch from '@/utils/fetch'

export function addDashboard(data) {
  return fetch({
    url: '/dashboard/create',
    method: 'POST',
    data
  })
}

export function updateDashboard(data) {
  return fetch({
    url: '/dashboard/update',
    method: 'POST',
    data
  })
}

export function getdDashboardById(id) {
  return fetch({
    url: `/dashboard/${id}`
  })
}

export function deleteDashboard(data) {
  return fetch({
    url: `/dashboard/delete`,
    method: 'post',
    data
  })
}

export function dashboardList() {
  return fetch({
    url: `/dashboard/list`
  })
}

export function addChartToDB(data) {
  return fetch({
    url: '/chartboard/map',
    method: 'POST',
    data
  })
}

export function chartByDashboard(id) {
  return fetch({
    url: `/chartboardmap/chartbydashboard?dashboard_id=${id}`
  })
}

export function dbByChart(id) {
  return fetch({
    url: `/chartboardmap/boardbychart?chart_id=${id}`
  })
}

export function unMapChartDb(data) {
  return fetch({
    url: '/chartboard/unmap',
    method: 'POST',
    data
  })
}

export function dbOrder(data) {
  return fetch({
    url: '/dashboard/order',
    method: 'POST',
    data
  })
}
