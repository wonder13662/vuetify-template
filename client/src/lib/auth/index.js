import graphql from '@/lib/graphql';
// import socket from '@/lib/socket';

export default {
  async postProcessSignIn(accessToken = null, refreshToken = null) {
    if (!accessToken || !refreshToken) throw new Error('token이 유효하지 않습니다.');
    // 1. graphql client 설정
    graphql.initialize();
    // 2. Socket client 설정
    // socket.initialize(); // FIX ME 아직 소켓 서버 연동에 문제가 있음
  },
  async postProcessSignOut() {
    // 1. graphql client 종료
    graphql.stop();
    // 2. Socket client 종료
    // socket.disconnect(); // FIX ME 아직 소켓 서버 연동에 문제가 있음
    // 99. Store 초기화 - 흐름만 만들어 놓자
  },
};
