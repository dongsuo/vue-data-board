import VueRouter from 'vue-router'
// import { getToken } from '@/utils/auth' // getToken from cookie
// import { getUserInfo } from '@/api/user'
import store from '../store'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/signup', component: () => import('@/views/login/signup') },
  { path: '/', component: () => import('@/views/index') },
  { path: '/dashboard', component: () => import('@/views/Dashboard') },
  { path: '/chartpanel/:id', component: () => import('@/views/ChartPanel'), meta: { activeMenu: '/chartpanel/create' }},
  { path: '/fullscreendb/:id', component: () => import('@/views/Dashboard/fullScreenDb') },
  { path: '/source', component: () => import('@/views/source/index') },
  { path: '*', component: () => import('@/views/NotFound') }
]

export const menuRoutes = routes

const router = new VueRouter({
  mode: 'history',
  routes
})

const whiteList = ['/login', '/auth-redirect', '/signup']

router.beforeEach(async(to, from, next) => {
  if (store.state.user.username) {
    if (to.name === 'login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
    next()
  } else {
    try {
      await store.dispatch('user/GetUserInfo')
      next()
    } catch (err) {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

export default router
