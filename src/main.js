import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
// import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

import App from './App.vue'

import i18n from './i18n'

import './icons'

Vue.config.productionTip = false
console.log(process.env)
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    release: 'vislib@' + process.env.npm_package_version,
    dsn: 'https://9d8ee0ea1a2749949dd1e641b0f7c071@o286322.ingest.sentry.io/5217806',
    integrations: [new VueIntegration({ Vue, attachProps: true })]
  })
}

store.commit('app/SET_LANG', 'CN')

Vue.use(VueRouter)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(VueI18n)

new Vue({
  router,
  store,
  i18n,
  el: '#app', // equivalent to mount
  render: h => h(App)
})
