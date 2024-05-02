import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks',
        name: 'Stocks',
        redirect: '/stocks/monitor',
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks/monitor',
        name: 'Monitor',
        component: () => import('@/views/stocks/MonitorStocks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks/gudang',
        name: 'Gudang',
        component: () => import('@/views/stocks/GudangStocks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks/service',
        name: 'Diservice',
        component: () => import('@/views/stocks/DiserviceStocks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks/pinjam',
        name: 'Dipinjam',
        component: () => import('@/views/stocks/DipinjamStocks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/stocks/terjual',
        name: 'Terjual',
        component: () => import('@/views/stocks/TerjualStocks.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/pinjam',
        name: 'Pinjam',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/pinjam/dipinjamkan',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/pinjam/dipinjamkan',
            name: 'Dipinjamkan',
            component: () => import('@/views/pinjam/DipinjamkanPinjam.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/pinjam/dikembalikan',
            name: 'Dikembalikan',
            component: () => import('@/views/pinjam/DikembalikanPinjam.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/services',
        name: 'Services',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/services/tambahdata',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/services/tambahdata',
            name: 'Tambah Baru',
            component: () => import('@/views/services/TambahDataServices.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/antrianpelanggan',
            name: 'Antrian Pelanggan',
            component: () => import('@/views/services/AntrianPelanggan.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/validasipelanggan',
            name: 'Checks & Radios',
            component: () => import('@/views/services/ValidasiPelanggan.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/selesaipelanggan',
            name: 'Selesai Pelanggan',
            component: () => import('@/views/services/SelesaiPelanggan.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/antrianstocks',
            name: 'Antrian Stocks',
            component: () => import('@/views/services/AntrianStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/validasistocks',
            name: 'Validasi Stocks',
            component: () => import('@/views/services/ValidasiStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/selesaistocks',
            name: 'Selesai Stocks',
            component: () => import('@/views/services/SelesaiStocks.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/spareparts',
        name: 'Spareparts',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/spareparts/stockspareparts',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/spareparts/stockspareparts',
            name: 'Stock Spareparts',
            component: () => import('@/views/spareparts/StockSpareparts.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/spareparts/loghistory',
            name: 'Log History',
            component: () => import('@/views/spareparts/LogHistorySpareparts.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/firmwares',
        name: 'Firmwares',
        component: () => import('@/views/firmwares/FirmwaresImin.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/devices',
        name: 'Devices',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/devices/devicesstocks',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/devices/devicesstocks',
            name: 'Devices Stocks',
            component: () => import('@/views/devices/DevicesStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/devices/devicespinjam',
            name: 'Devices Pinjam',
            component: () => import('@/views/devices/DevicesPinjam.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/devices/devicesservices',
            name: 'Devices Services',
            component: () => import('@/views/devices/DevicesServices.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/widgets',
        name: 'Widgets',
        component: () => import('@/views/widgets/Widgets.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'LoginPage',
        component: () => import('@/views/pages/LoginPage'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')

  if (to.name === 'LoginPage' && isLoggedIn) {
    next({ name: 'Dashboard' })
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'LoginPage' })
  } else {
    next()
  }
})

export default router
