import axios from 'axios'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import store from '../store'

let baseURL = process.env.VUE_APP_BASE_API
if (process.env.NODE_ENV === 'production') {
  baseURL = `//api.${location.host}/api`
}

const fetchInstance = axios.create({
  baseURL
  // timeout: 2000,
})

// request拦截器
fetchInstance.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['DS-Token'] = Cookies.get('DS-Token')
  }
  config.withCredentials = true
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// response拦截器
fetchInstance.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('request error')
    } else {
      return response.data
    }
  },
  error => {
    if (error.message !== 'cancel') {
      console.log('err:' + error)// for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    // Raven.captureException(error)
    return Promise.reject(error)
  }
)

export default fetchInstance
