import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path:'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: "/person",
    component: Layout,
    children: [
      {
        path: '/person/messagePerson',
        component: () => import('@/views/person/messagePerson'),
        name: 'AddPerson',
        meta: { title: '人员管理',icon: 'edit', roles: [3, 4] }
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: '/goods/messageGoods',
        component: () => import('@/views/goods/messageGoods'),
        name: 'MessageGoods',
        meta: { title: '商品管理',icon: 'list', roles: [3, 4] }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    children: [
      {
        path: '/order/orderManger',
        component: () => import('@/views/order/orderManger'),
        name: 'orderManger',
        meta: { title: '订单管理',icon: 'list', roles: [3, 4] }
      },
      {
        path: '/order/orderDisplay',
        component: () => import('@/views/user/order/orderCheck'),
        name: 'orderManger',
        meta: { title: '我的订单',icon: 'list', roles: [1, 2] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
