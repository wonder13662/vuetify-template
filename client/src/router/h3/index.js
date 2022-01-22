export default [
  {
    path: '/h3',
    name: 'H3',
    component: () => import('@/views/h3/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];
