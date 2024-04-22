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
    icon: 'cil-cursor',
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
    name: 'Pinjam',
    to: '/pinjam',
    icon: 'cil-pencil',
    items: [
      {
        component: 'CNavItem',
        name: 'Dipinjamkan',
        to: '/pinjam/dipinjamkan',
      },
      {
        component: 'CNavItem',
        name: 'Dikembalikan',
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
    icon: 'cil-puzzle',
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
    component: 'CNavItem',
    name: 'Firmwares',
    to: '/firmwares',
    icon: 'cil-notes',
  },
]
