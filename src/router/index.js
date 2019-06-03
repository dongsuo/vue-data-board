import VueRouter from 'vue-router'

const routes = [
  { path: '/login', component: () => import('@/views/login') },
  { path: '/', component: () => import('@/views/index') },
  { path: '/dashboard', component: () => import('@/views/Dashboard') },
  { path: '/chartpanel/:id', component: () => import('@/views/ChartPanel'), meta: { activeMenu: '/chartpanel/create' }},
  { path: '*', component: () => import('@/views/NotFound') }
]

export const menuRoutes = routes

export default new VueRouter({
  routes
})
