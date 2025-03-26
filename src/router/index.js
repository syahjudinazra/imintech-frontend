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
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/stocks/monitor',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'monitor',
            name: 'Monitor',
            component: () => import('@/views/stocks/MonitorStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'allstocks',
            name: 'AllStocks',
            component: () => import('@/views/stocks/AllStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'warehouse',
            name: 'Warehouse',
            component: () => import('@/views/stocks/WarehouseStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'in-services',
            name: 'In Services',
            component: () => import('@/views/stocks/ServicesStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'in-loan',
            name: 'In Loan',
            component: () => import('@/views/stocks/LoanStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'sold',
            name: 'Sold',
            component: () => import('@/views/stocks/SoldStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'damage',
            name: 'Damage',
            component: () => import('@/views/stocks/DamagedStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'entrust',
            name: 'Entrust',
            component: () => import('@/views/stocks/EntrustStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'stocks-activity',
            name: 'Stocks Activity',
            component: () => import('@/views/stocks/StocksActivity.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/loan',
        name: 'Loan',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/loan/on-loan',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/loan/on-loan',
            name: 'On Loan',
            component: () => import('@/views/Loan/LoanTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/loan/returned',
            name: 'Returned',
            component: () => import('@/views/Loan/ReturnedTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'loan-activity',
            name: 'Loan Activity',
            component: () => import('@/views/Loan/LoanActivity.vue'),
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
        redirect: '/services/add-new',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/services/add-new',
            name: 'Add New Service',
            component: () => import('@/views/services/AddNew.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/incoming-customers',
            name: 'Customers',
            component: () => import('@/views/services/IncomingCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/incoming-stocks',
            name: 'Stock',
            component: () => import('@/views/services/IncomingStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/queue-customers',
            name: 'Queue Customers',
            component: () => import('@/views/services/QueueCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/pending-customers',
            name: 'Pending Customers',
            component: () => import('@/views/services/PendingCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/validation-customers',
            name: 'Validation Customers',
            component: () => import('@/views/services/ValidationCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/delivery-customers',
            name: 'Delivery Customers',
            component: () => import('@/views/services/DeliveryCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/done-customers',
            name: 'Done Customers',
            component: () => import('@/views/services/DoneCustomers.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/queue-stocks',
            name: 'Queue Stocks',
            component: () => import('@/views/services/QueueStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/pending-stocks',
            name: 'Pending Stocks',
            component: () => import('@/views/services/PendingStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/validation-stocks',
            name: 'Validation Stocks',
            component: () => import('@/views/services/ValidationStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/delivery-stocks',
            name: 'Delivery Stocks',
            component: () => import('@/views/services/DeliveryStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/done-stocks',
            name: 'Done Stocks',
            component: () => import('@/views/services/DoneStocks.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/manual-quotation',
            name: 'Manual Quotation',
            component: () => import('@/views/services/TemporaryNote.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/services/services-activity',
            name: 'Services Activity',
            component: () => import('@/views/services/ServicesActivity.vue'),
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
            path: '/spareparts/list-spareparts',
            name: 'List Spareparts',
            component: () => import('@/views/spareparts/SparepartsTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/spareparts/spareparts-activity',
            name: 'Spareparts Activity',
            component: () => import('@/views/spareparts/SparepartsActivity.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/firmwares',
        name: 'Firmwares',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/firmwares/list',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/firmwares/list',
            component: () => import('@/views/firmwares/FirmwaresImin.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/firmwares/table',
            name: 'Firmwares Table',
            component: () => import('@/views/firmwares/FirmwaresTable.vue'),
          },
          {
            path: '/firmwares/firmwares-activity',
            name: 'Firmwares Activity',
            component: () => import('@/views/firmwares/FirmwaresActivity.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/firmwares/list/m2-202',
            name: 'M2-202',
            component: () => import('@/components/Firmwares/M2-202.vue'),
          },
          {
            path: '/firmwares/list/m2-203',
            name: 'M2-203',
            component: () => import('@/components/Firmwares/M2-203.vue'),
          },
          {
            path: '/firmwares/list/m2-pro',
            name: 'M2-Pro',
            component: () => import('@/components/Firmwares/M2-Pro.vue'),
          },
          {
            path: '/firmwares/list/m2-max',
            name: 'M2-Max',
            component: () => import('@/components/Firmwares/M2-Max.vue'),
          },
          {
            path: '/firmwares/list/swift-1',
            name: 'Swift 1',
            component: () => import('@/components/Firmwares/Swift-1.vue'),
          },
          {
            path: '/firmwares/list/swift-1-pro',
            name: 'Swift 1 Pro',
            component: () => import('@/components/Firmwares/Swift-1-Pro.vue'),
          },
          {
            path: '/firmwares/list/swift-2',
            name: 'Swift 2',
            component: () => import('@/components/Firmwares/Swift-2.vue'),
          },
          {
            path: '/firmwares/list/swift-2-pro',
            name: 'Swift 2 Pro',
            component: () => import('@/components/Firmwares/Swift-2-Pro.vue'),
          },
          {
            path: '/firmwares/list/d1',
            name: 'D1',
            component: () => import('@/components/Firmwares/D-1.vue'),
          },
          {
            path: '/firmwares/list/d1-pro',
            name: 'D1 Pro',
            component: () => import('@/components/Firmwares/D-1-Pro.vue'),
          },
          {
            path: '/firmwares/list/falcon-1',
            name: 'Falcon 1',
            component: () => import('@/components/Firmwares/Falcon-1.vue'),
          },
          {
            path: '/firmwares/list/d2',
            name: 'D2',
            component: () => import('@/components/Firmwares/D-2.vue'),
          },
          {
            path: '/firmwares/list/d3',
            name: 'D3',
            component: () => import('@/components/Firmwares/D-3.vue'),
          },
          {
            path: '/firmwares/list/d4',
            name: 'D4',
            component: () => import('@/components/Firmwares/D-4.vue'),
          },
          {
            path: '/firmwares/list/d4-pro',
            name: 'D4 Pro',
            component: () => import('@/components/Firmwares/D-4-Pro.vue'),
          },
          {
            path: '/firmwares/list/swan-1',
            name: 'Swan 1',
            component: () => import('@/components/Firmwares/Swan-1.vue'),
          },
          {
            path: '/firmwares/list/swan-1-pro',
            name: 'Swan 1 Pro',
            component: () => import('@/components/Firmwares/Swan-1-Pro.vue'),
          },
          {
            path: '/firmwares/list/crane-1',
            name: 'Crane 1',
            component: () => import('@/components/Firmwares/Crane-1.vue'),
          },
          {
            path: '/firmwares/list/s1',
            name: 'S1',
            component: () => import('@/components/Firmwares/S-1.vue'),
          },
          {
            path: '/firmwares/list/k1',
            name: 'K1',
            component: () => import('@/components/Firmwares/K-1.vue'),
          },
          {
            path: '/firmwares/list/k2',
            name: 'K2',
            component: () => import('@/components/Firmwares/K-2.vue'),
          },
        ],
      },
      {
        path: '/devices',
        name: 'Devices',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/list/devices',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/list/stocks-device',
            name: 'Stocks Device',
            component: () => import('@/views/list/devices/StocksDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/list/stocks-sku-device',
            name: 'Stocks SKU Devices',
            component: () => import('@/views/list/devices/StocksSkuDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/list/loan-device',
            name: 'Loan Devices',
            component: () => import('@/views/list/devices/LoanDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/list/services-device',
            name: 'Services Devices',
            component: () => import('@/views/list/devices/ServicesDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/list/spareparts-device',
            name: 'Spareparts Devices',
            component: () => import('@/views/list/devices/SparepartsDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/list/firmwares-device',
            name: 'Firmwares Devices',
            component: () => import('@/views/list/devices/FirmwaresDeviceTable.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/components',
        name: 'Components',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/list/components',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/components/ram',
            name: 'Ram List',
            component: () => import('@/views/list/RamTable.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/components/android',
            name: 'Android List',
            component: () => import('@/views/list/AndroidTable.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/technician',
        name: 'Technician',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/list/technician',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/list/technician',
            name: 'Technician List',
            component: () => import('@/views/list/TechnicianTable.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/location',
        name: 'Location',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/list/location',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/list/location',
            name: 'Location Stocks List',
            component: () => import('@/views/list/LocationTable.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/sales',
        name: 'Sales',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/list/sales',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/list/sales',
            name: 'Sales List',
            component: () => import('@/views/list/SalesTable.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/users/management',
        name: 'UsersManagement',
        component: () => import('@/views/users/UsersManagement.vue'),
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
        component: () => import('@/views/pages/RegisterPage'),
      },
      {
        path: 'forgotpassword',
        name: 'ForgotPassword',
        component: () => import('@/views/pages/ForgotPassword'),
      },
      {
        path: 'ask-permissions',
        name: 'askPermissions',
        component: () => import('@/components/StatusPage/404Page'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
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

  // Check if user is logged in
  if (to.name === 'LoginPage' && isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'LoginPage' })
    return
  }

  next()
})

export default router
