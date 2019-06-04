import fetch from '@/utils/fetch'

export function login(data) {
  return fetch({
    url: '/user/login',
    method: 'POST',
    data
  })
}

export function signup(data) {
  return fetch({
    url: '/user/signup',
    method: 'POST',
    data
  })
}
