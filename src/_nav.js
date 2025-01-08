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
        name: 'All Stocks',
        to: '/stocks/allstocks',
      },
      {
        component: 'CNavItem',
        name: 'Warehouse',
        to: '/stocks/warehouse',
      },
      {
        component: 'CNavItem',
        name: 'Services',
        to: '/stocks/in-services',
      },
      {
        component: 'CNavItem',
        name: 'Loan',
        to: '/stocks/in-loan',
      },
      {
        component: 'CNavItem',
        name: 'Sold',
        to: '/stocks/sold',
      },
      {
        component: 'CNavItem',
        name: 'Damage',
        to: '/stocks/damage',
      },
      {
        component: 'CNavItem',
        name: 'Entrust',
        to: '/stocks/entrust',
      },
      {
        component: 'CBadge',
        name: 'Log Activity',
      },
      {
        component: 'CNavItem',
        name: 'Stocks Activity',
        to: '/stocks/stocks-activity',
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
    to: '/loan',
    icon: 'cil-pencil',
    items: [
      {
        component: 'CNavItem',
        name: 'On Loan',
        to: '/loan/on-loan',
      },
      {
        component: 'CNavItem',
        name: 'Returned',
        to: '/loan/returned',
      },
      {
        component: 'CBadge',
        name: 'Log Activity',
      },
      {
        component: 'CNavItem',
        name: 'Loan Activity',
        to: '/loan/loan-activity',
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
    to: '/services',
    icon: 'cil-cog',
    items: [
      {
        component: 'CNavItem',
        name: 'Add New Service',
        to: '/services/add-new',
      },
      {
        component: 'CNavItem',
        name: 'Pending Customers',
        to: '/services/pending-customers',
      },
      {
        component: 'CNavItem',
        name: 'Validation Customers',
        to: '/services/validation-customers',
      },
      {
        component: 'CNavItem',
        name: 'Done Customers',
        to: '/services/done-customers',
      },
      {
        component: 'CNavItem',
        name: 'Pending Stocks',
        to: '/services/pending-stocks',
      },
      {
        component: 'CNavItem',
        name: 'Validation Stocks',
        to: '/services/validation-stocks',
      },
      {
        component: 'CNavItem',
        name: 'Done Stocks',
        to: '/services/done-stocks',
      },
      {
        component: 'CBadge',
        name: 'Others',
      },
      {
        component: 'CNavItem',
        name: 'Temporary Note',
        to: '/services/temporary-note',
      },
      {
        component: 'CNavItem',
        name: 'Services Activity',
        to: '/services/services-activity',
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
        name: 'List Spareparts',
        to: '/spareparts/list-spareparts',
      },
      {
        component: 'CBadge',
        name: 'Log Activity',
      },
      {
        component: 'CNavItem',
        name: 'Spareparts Activity',
        to: '/spareparts/spareparts-activity',
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
        to: '/firmwares/list',
      },
      {
        component: 'CNavItem',
        name: 'Firmwares Table',
        to: '/firmwares/table',
      },
      {
        component: 'CBadge',
        name: 'Log Activity',
      },
      {
        component: 'CNavItem',
        name: 'Firmwares Activity',
        to: '/firmwares/firmwares-activity',
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
        to: '/list/loan-device',
      },
      {
        component: 'CNavItem',
        name: 'Services Devices',
        to: '/list/services-device',
      },
      {
        component: 'CNavItem',
        name: 'SpareParts Devices',
        to: '/list/spareparts-device',
      },
      {
        component: 'CNavItem',
        name: 'Firmwares Devices',
        to: '/list/firmwares-device',
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
    component: 'CNavItem',
    name: 'Users Management',
    to: '/users/management',
    icon: 'cil-user',
  },
]
