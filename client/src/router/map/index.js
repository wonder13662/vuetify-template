export default [
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/map/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];
