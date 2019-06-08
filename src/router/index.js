import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth' // getToken from cookie

const routes = [
  { path: '/login', component: () => import('@/views/login') },
  { path: '/signup', component: () => import('@/views/login/signup') },
  { path: '/', component: () => import('@/views/index') },
  { path: '/dashboard', component: () => import('@/views/Dashboard') },
  { path: '/chartpanel/:id', component: () => import('@/views/ChartPanel'), meta: { activeMenu: '/chartpanel/create' }},
  { path: '*', component: () => import('@/views/NotFound') }
]

export const menuRoutes = routes

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/auth-redirect', '/signup']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    next()
  } else {
    if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

export default router
