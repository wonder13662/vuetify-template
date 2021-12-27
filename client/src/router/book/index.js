export default [
  {
    path: '/',
    redirect: '/book',
  },
  {
    path: '/book',
    component: () => import('@/views/book'),
  },
];
