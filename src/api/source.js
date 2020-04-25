import fetch from '@/utils/fetch'

export function addSource(data) {
  return fetch({
    url: 'source/create',
    method: 'POST',
    data
  })
}

export function updateSource(data) {
  return fetch({
    url: 'source/update',
    method: 'POST',
    data
  })
}

export function deleteSource(data) {
  return fetch({
    url: 'source/delete',
    method: 'POST',
    data
  })
}

export function sourceList() {
  return fetch({
    url: 'source/list',
    method: 'get'
  })
}

export function tablesByBase(sourceId) {
  return fetch({
    url: `source/tables/${sourceId}`,
    method: 'get'
  })
}

export function saveTableConfig(data) {
  return fetch({
    url: 'source/tables/save',
    method: 'POST',
    data
  })
}

export function linkedTablesByBase(sourceId) {
  return fetch({
    url: `source/tables/${sourceId}/linked`,
    method: 'get'
  })
}
