export default [
  {
    path: '/',
    redirect: '/admin/delivery',
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/layout'),
    children: [
      {
        path: '',
        redirect: { name: 'Dashboard' },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/dashboard'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/admin/notice'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'physical-group/list',
        name: 'PhysicalGroupList',
        component: () => import('@/views/admin/physicalGroup/list'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'physical-group/out-of-bound',
        name: 'PhysicalGroupOutOfBound',
        component: () => import('@/views/admin/physicalGroup/outOfBound'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'physical-group/extra-charge',
        name: 'PhysicalGroupExtraCharge',
        component: () => import('@/views/admin/physicalGroup/extraCharge'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'director/approve',
        name: 'DirectorApprove',
        component: () => import('@/views/admin/director/approve'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'director/director-list',
        name: 'DirectorList',
        component: () => import('@/views/admin/director/directorList'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'director/director-group-list',
        name: 'DirectorGroupList',
        component: () => import('@/views/admin/director/directorGroupList'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'driver/driver-approve',
        name: 'DriverApprove',
        component: () => import('@/views/admin/driver/driverApprove'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'driver/black-driver-approve',
        name: 'BlackDriverApprove',
        component: () => import('@/views/admin/driver/blackDriverApprove'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'driver/driver-list',
        name: 'DriverList',
        component: () => import('@/views/admin/driver/driverList'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'driver/driver-group-list',
        name: 'DriverGroupList',
        component: () => import('@/views/admin/driver/driverGroupList'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'cs-ticket',
        name: 'csTicket',
        component: () => import('@/views/admin/csTicket'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'fee-adjust',
        name: 'FeeAdjust',
        component: () => import('@/views/admin/feeAdjust'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('@/views/admin/stats'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'map/default',
        name: 'defaultMap',
        component: () => import('@/views/admin/map/defaultMap'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'map/h3-map',
        name: 'h3Map',
        component: () => import('@/views/admin/map/h3Map'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'map/marker-map',
        name: 'markerMap',
        component: () => import('@/views/admin/map/markerMap'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];
