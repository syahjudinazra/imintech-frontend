export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Warehouse',
  },
  {
    component: 'CNavGroup',
    name: 'Stocks',
    to: '/stocks',
    icon: 'cil-inbox',
    items: [
      {
        component: 'CNavItem',
        name: 'Monitor',
        to: '/stocks/monitor',
      },
      {
        component: 'CNavItem',
        name: 'Gudang',
        to: '/stocks/gudang',
      },
      {
        component: 'CNavItem',
        name: 'Diservice',
        to: '/stocks/service',
      },
      {
        component: 'CNavItem',
        name: 'Dipinjam',
        to: '/stocks/pinjam',
      },
      {
        component: 'CNavItem',
        name: 'Terjual',
        to: '/stocks/terjual',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Delivery',
    to: '/delivery',
    icon: 'cil-truck',
    items: [
      {
        component: 'CNavItem',
        name: 'Customer Delivery',
        to: '/delivery/customer',
      },
      {
        component: 'CNavItem',
        name: 'Warehouse Delivery',
        to: '/delivery/warehouse',
      },
      {
        component: 'CNavItem',
        name: 'Service Delivery',
        to: '/delivery/service',
      },
      {
        component: 'CNavItem',
        name: 'Loan Delivery',
        to: '/delivery/loan',
      },
      {
        component: 'CNavItem',
        name: 'Sold Delivery',
        to: '/delivery/sold',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Loan',
    to: '/pinjam',
    icon: 'cil-pencil',
    items: [
      {
        component: 'CNavItem',
        name: 'On Loan',
        to: '/pinjam/dipinjamkan',
      },
      {
        component: 'CNavItem',
        name: 'Returned',
        to: '/pinjam/dikembalikan',
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Devices',
  },
  {
    component: 'CNavGroup',
    name: 'Services',
    to: '/service',
    icon: 'cil-cog',
    items: [
      {
        component: 'CNavItem',
        name: 'Tambah Baru',
        to: '/services/tambahdata',
      },
      {
        component: 'CNavItem',
        name: 'Antrian Pelanggan',
        to: '/services/antrianpelanggan',
      },
      {
        component: 'CNavItem',
        name: 'Validasi Pelanggan',
        to: '/services/validasipelanggan',
      },
      {
        component: 'CNavItem',
        name: 'Selesai Pelanggan',
        to: '/services/selesaipelanggan',
      },
      {
        component: 'CNavItem',
        name: 'Antrian Stocks',
        to: '/services/antrianstocks',
      },
      {
        component: 'CNavItem',
        name: 'Validasi Stocks',
        to: '/services/validasistocks',
      },
      {
        component: 'CNavItem',
        name: 'Selesai Stocks',
        to: '/services/selesaistocks',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Spareparts',
    to: '/spareparts',
    icon: 'cil-calculator',
    items: [
      {
        component: 'CNavItem',
        name: 'Stock Spareparts',
        to: '/spareparts/stockspareparts',
      },
      {
        component: 'CNavItem',
        name: 'Log History',
        to: '/spareparts/loghistory',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Firmwares',
    to: '/firmwares',
    icon: 'cil-memory',
    items: [
      {
        component: 'CNavItem',
        name: 'Firmwares',
        to: '/firmwares/information',
      },
      {
        component: 'CNavItem',
        name: 'Firmwares Table',
        to: '/firmwares/table',
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'List',
  },
  {
    component: 'CNavGroup',
    name: 'Devices',
    to: '/devices',
    icon: 'cil-devices',
    items: [
      {
        component: 'CNavItem',
        name: 'Stocks Devices',
        to: '/list/stocks-device',
      },
      {
        component: 'CNavItem',
        name: 'Stocks SKU Devices',
        to: '/list/stocks-sku-device',
      },
      {
        component: 'CNavItem',
        name: 'Loan Devices',
        to: '/devices/devicespinjam',
      },
      {
        component: 'CNavItem',
        name: 'Services Devices',
        to: '/devices/devicesservices',
      },
      {
        component: 'CNavItem',
        name: 'SpareParts Devices',
        to: '/devices/spareparts',
      },
      {
        component: 'CNavItem',
        name: 'Firmwares Devices',
        to: '/devices/firmwares',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Components',
    to: '/components',
    icon: 'cil-fork',
    items: [
      {
        component: 'CNavItem',
        name: 'RAM',
        to: '/components/ram',
      },
      {
        component: 'CNavItem',
        name: 'Android',
        to: '/components/android',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Technician',
    to: '/technician',
    icon: 'cil-user-plus',
    items: [
      {
        component: 'CNavItem',
        name: 'List Technician',
        to: '/list/technician',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Location',
    to: '/location',
    icon: 'cil-location-pin',
    items: [
      {
        component: 'CNavItem',
        name: 'List Stocks Location',
        to: '/list/location',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Sales',
    to: '/sales',
    icon: 'cil-people',
    items: [
      {
        component: 'CNavItem',
        name: 'List Sales',
        to: '/list/sales',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Customers',
    to: '/customers',
    icon: 'cil-address-book',
    items: [
      {
        component: 'CNavItem',
        name: 'List Customers',
        to: '/list/customers',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Users Management',
    to: '/users/management',
    icon: 'cil-user',
  },
]
