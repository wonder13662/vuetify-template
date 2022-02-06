import Vue from 'vue';
import VueRouter from 'vue-router';
import auth from './auth';
import book from './book';
import h3 from './h3';
import system from './system';
import template from './template';
import store from '@/store';

Vue.use(VueRouter);

// 사용자가 같은 페이지 주소를 클릭했을 때의 에러 메시지를 노출하자 않도록 설정
// https://velog.io/@hschoi1104/Vue.js-NavigationDuplicated-%EC%97%90%EB%9F%AC-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0
// https://stackoverflow.com/questions/58634914/getting-navigation-duplicated-error-while-the-route-is-being-replaced-on-vue-rou/59541856#59541856
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (err && err.name !== 'NavigationDuplicated') throw err;
  });
};

// TODO route-matching
// https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js

// 참고: nginx 설정(nginx/default.conf)으로 history mode를 사용할 수 있음.
// https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

const routes = [
  ...auth,
  ...book,
  ...h3,
  ...system,
  ...template,
];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

let entryUrl = null; // 사용자가 입력한 url을 인증이 완료되기 전까지 보관
router.beforeEach((to, from, next) => {
  // TODO 로그인인증 방식이 개선되면 localStorage를 사용하지 않는 방향으로 수정
  const { permissions } = store.state.auth.user;
  const isSuper = permissions && permissions.super;
  // https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isMaintenanceMode = process.env.VUE_APP_SERVICE_MAINTENANCE === 'true';
  const loggedIn = store.getters['auth/loggedIn'];

  if (to.path === '/admin/super' && !isSuper) {
    // 1. 슈퍼 유저 권한이 없는 경우는 홈으로 이동
    next('/');
  } else if (requiresAuth && !loggedIn) {
    // 2. 로그인되지 않았음 혹은 저장된 AccesToken이 유효하지 않음. 로그인 페이지로 이동
    entryUrl = to.path;
    next('/auth/sign-in');
  } else if (to.path !== '/system/maintenance' && isMaintenanceMode) {
    // 4-1. 서비스 점검시라면, 서비스 점검 페이지로 이동
    // 4-2. 서비스 점검 페이지 진입시 다시 이곳을 타지 않도록 to.path를 검사
    next('/system/maintenance');
  } else if (to.path === '/system/maintenance' && !isMaintenanceMode) {
    // 5. 서비스 점검시가 아닐때, 서비스 점검 페이지로 강제로 이동하려 한다면, 최상위 페이지로 이동
    next('/');
  } else if (requiresAuth && entryUrl) {
    // 6. 인증 전에 입력했던 페이지로 인증후에 리다이렉트
    const url = entryUrl;
    entryUrl = null;
    next(url);
  } else {
    // 7. 다음 페이지로 이동
    // Make sure that the next function is called exactly once.
    // https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
    next();
  }
});

export default router;
