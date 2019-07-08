import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import Cookies from 'js-cookie'
import store from '../store'

const fetchInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // timeout: 2000,
})

// request拦截器
fetchInstance.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['DS-Token'] = Cookies.get('DS-Token')
  }
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

      // 40003:登录失败
      if (res.code === 40003) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        // 排除登出的请求错误
        // Raven.captureException(requestErrorFormat(response))
        console.log('err:' + requestErrorFormat(response))// for debug
      }
      return Promise.reject('request error')
    } else {
      return response.data
    }
  },
  error => {
    if (error.code === 429) {
      Message({
        message: '请求过于频繁，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
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

function requestErrorFormat(res) {
  const o = {
    url: res.request && res.request.responseURL,
    res: res.request && res.request.response
  }
  return JSON.stringify(o)
}
