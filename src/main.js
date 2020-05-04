import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

import App from './App.vue'

import './icons'

Vue.config.productionTip = false

Sentry.init({
  release: 'my-project-name@' + process.env.npm_package_version,
  dsn: 'https://9d8ee0ea1a2749949dd1e641b0f7c071@o286322.ingest.sentry.io/5217806',
  integrations: [new VueIntegration({ Vue, attachProps: true })]
})

Vue.use(VueRouter)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  el: '#app', // equivalent to mount
  render: h => h(App)
})
