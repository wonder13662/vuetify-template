export default [
  {
    path: '/template',
    name: 'Template',
    component: () => import('@/views/templates/index.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'wireframe',
        name: 'Wireframe',
        component: () => import('@/views/templates/wireframes/index.vue'),
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: 'base',
            name: 'Base',
            component: () => import('@/views/templates/wireframes/Base.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'constrained',
            name: 'Constrained',
            component: () => import('@/views/templates/wireframes/Constrained.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'data-dog',
            name: 'DataDog',
            component: () => import('@/views/templates/wireframes/DataDog.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'discord',
            name: 'Discord',
            component: () => import('@/views/templates/wireframes/Discord.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'extended-toolbar',
            name: 'ExtendedToolbar',
            component: () => import('@/views/templates/wireframes/ExtendedToolbar.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'inbox',
            name: 'Inbox',
            component: () => import('@/views/templates/wireframes/Inbox.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'side-navigation',
            name: 'SideNavigation',
            component: () => import('@/views/templates/wireframes/SideNavigation.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'steam',
            name: 'Steam',
            component: () => import('@/views/templates/wireframes/Steam.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'system-bar',
            name: 'SystemBar',
            component: () => import('@/views/templates/wireframes/SystemBar.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'three-column',
            name: 'ThreeColumn',
            component: () => import('@/views/templates/wireframes/ThreeColumn.vue'),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
];
