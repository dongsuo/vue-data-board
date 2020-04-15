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
