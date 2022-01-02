<template>
  <router-view />
</template>

<script>
import store from '@/store';
import axios from '@/lib/axios';
import auth from '@/lib/auth';

/* eslint-disable no-console */
export default {
  name: 'App',
  async created() {
    axios.initialize();

    // 1. 웹 클라이언트는 localStorage에 저장된 Token이 유효한지 확안힌다.
    await store.dispatch('auth/verifyToken');
    const loggedIn = store.getters['auth/loggedIn'];
    if (!loggedIn) {
      // 2-1. localStorage에 저장된 토큰이 유효하지 않다면, 로그인 페이지로 이동한다.
      await store.dispatch('auth/signOut');
      auth.postProcessSignOut();
      await this.$router.push({ path: '/auth/sign-in' });
    } else {
      // 2-2. localStroage에 저장된 토큰이 유효하다면,
      // 2-2-1. graphql을 초기화한다.
      // 2-2-2. socketio를 초기화한다.
      const accessToken = store.getters['auth/accessToken'];
      const refreshToken = store.getters['auth/refreshToken'];
      auth.postProcessSignIn(accessToken, refreshToken);
      // 2-2-3. Driver 화면으로 이동한다.
      // TODO 사용자가 웹 브라우저를 새로고침한 것이라면 새로고침하기 직전의 페이지 주소로 이동해야 한다.
      await this.$router.push({ path: '/book' });
    }
  },
};
</script>
