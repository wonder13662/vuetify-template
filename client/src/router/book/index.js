export default [
  {
    path: '/',
    redirect: '/book',
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import('@/views/book'),
    meta: {
      requiresAuth: true,
    },
  },
];
