import { authClient } from '@/lib/axios';
import graphql from '@/lib/graphql';
import socket from '@/lib/socket';

export default {
  async postProcessSignIn(accessToken = null, refreshToken = null) {
    if (!accessToken || !refreshToken) throw new Error('token이 유효하지 않습니다.');
    // 1. LocalStorage 설정
    localStorage.setItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN, accessToken);
    localStorage.setItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN, refreshToken);
    // 2. graphql client 설정
    graphql.initialize();
    // 3. Socket client 설정
    socket.initialize();
  },
  async postProcessSignOut() {
    // 1. Axios client들의 토큰 제거
    authClient.getInstance().removeAuthToken();
    // 2. LocalStorage 제거
    localStorage.removeItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
    localStorage.removeItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
    // 3. graphql client 종료
    graphql.stop();
    // 4. Socket client 종료
    socket.disconnect();
    // 99. Store 초기화 - 흐름만 만들어 놓자
  },
};
