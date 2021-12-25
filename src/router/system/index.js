export default [
  {
    path: '/system',
    component: () => import('@/views/system/layout/index'),
    children: [
      {
        path: '404',
        name: '404',
        alias: 'not-found',
        component: () => import('@/views/system/404'),
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('@/views/system/Maintenance'),
      },
    ],
  },
  // https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route
  // https://router.vuejs.org/guide/essentials/history-mode.html#caveat
  {
    path: '*',
    redirect: { path: '/system/404' },
  },
];
