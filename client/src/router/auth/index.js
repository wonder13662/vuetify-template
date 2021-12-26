export default [
  {
    path: '/auth',
    component: () => import('@/views/auth/layout/index'),
    children: [
      {
        path: 'sign-in',
        name: 'SignIn',
        component: () => import('@/views/auth/SignIn'),
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        component: () => import('@/views/auth/SignUp'),
      },
    ],
  },
];
