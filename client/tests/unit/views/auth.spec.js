import Vue from 'vue';
import { 
  createLocalVue,
} from '@vue/test-utils';
import Vuex from 'vuex'

import store from '@/store';

jest.mock('@/services', () => ({
  rest: {
    auth: {
      postSignIn: jest.fn(() => ({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJuYW1lIjoiS2F0ZSBTbWl0aCIsImVtYWlsIjoia2F0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBhc3MxMjM0In0sImlhdCI6MTY0MDYxNjMwMX0.GGK3BWxn8j-kIk3lXuieHV0J-bbMYB3928Iy4GnIAyY',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJuYW1lIjoiS2F0ZSBTbWl0aCIsImVtYWlsIjoia2F0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBhc3MxMjM0In0sImlhdCI6MTY0MDYxNjMwMX0.rk87tyn_lFn7YZ_yUAAABkGGNY1LKAhB1L2O8MlgTXw',
      })),
      verify: jest.fn(() => {
        return {
          isVerified: true,
        }
      }),
    },
  },
}));

describe('#1 [Vuex]Verify:로그인 전', () => {
  test('#1-1 LocalStorage에 저장된 accessToken이 없으므로 verify 실패', async () => {
    // 검사: loggedIn이 false 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeFalsy();
    // 검사: accessToken이 있어야 합니다.
    expect(store.getters['auth/accessToken']).toBeFalsy();
    // 이벤트: 사용자가 페이지를 리로딩 혹은 새로운 탭을 열어서 서비스를 사용
    // 이에 웹 어플리케이션은 localStorage에 저장된 accessToken을 서버에 verify 시도
    await store.dispatch('auth/verifyToken');
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 false 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeFalsy();
    // 검사: accessToken이 있어야 합니다.
    expect(store.getters['auth/accessToken']).toBeFalsy();
    // 검사: refreshToken이 있어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeFalsy();
  });
});

describe('#2 [Vuex]로그인', () => {
  test('#2-1 잘못된 email 입력, 실패', async () => {
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 로그인 정보로 유효하지 않은 email을 입력합니다.
    store.dispatch('auth/signIn', {
      email: undefined,
      password: 'pass1234',
    })
    // 검사: 저장된 에러가 1개 추가되어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러와 데이터 상태를 초기화
    store.dispatch('error/clearErrors');
  });
  test('#2-2 잘못된 password 입력, 실패', async () => {
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 로그인 정보로 유효하지 않은 email을 입력합니다.
    store.dispatch('auth/signIn', {
      email: 'kate@gmail.com',
      password: undefined,
    })
    // 검사: 저장된 에러가 1개 추가되어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러와 데이터 상태를 초기화
    store.dispatch('error/clearErrors');
  });  
  test('#2-3 정상적인 email, password 입력, 성공', async () => {
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 false 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeFalsy();
    // 검사: accessToken이 없어야 합니다.
    expect(store.getters['auth/accessToken']).toBeFalsy();
    // 검사: refreshToken이 없어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeFalsy();
    // 이벤트: 사용자가 로그인 정보로 유효하지 않은 email을 입력합니다.
    await store.dispatch('auth/signIn', {
      email: 'kate@gmail.com',
      password: 'pass1234',
    });
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 true 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeTruthy();
    // 검사: accessToken이 있어야 합니다.
    expect(store.getters['auth/accessToken']).toBeTruthy();
    // 검사: refreshToken이 있어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeTruthy();
  });    
});

describe('#3 [Vuex]Verify:로그인 완료 이후', () => {
  test('#3-1 LocalStorage에 저장된 accessToken이 있으므로 verify 성공', async () => {
    // 이벤트: 사용자가 페이지를 리로딩 혹은 새로운 탭을 열어서 서비스를 사용
    // 이에 웹 어플리케이션은 localStorage에 저장된 accessToken을 서버에 verify 시도
    await store.dispatch('auth/verifyToken');
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 true 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeTruthy();
    // 검사: accessToken이 있어야 합니다.
    expect(store.getters['auth/accessToken']).toBeTruthy();
    // 검사: refreshToken이 있어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeTruthy();
  });
});

describe('#4 [Vuex]로그아웃', () => {
  test('#4-1 로그아웃 성공', async () => {
    // 이벤트: 사용자가 로그아웃합니다.
    store.dispatch('auth/signOut');
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 false 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeFalsy();
    // 검사: accessToken이 없어야 합니다.
    expect(store.getters['auth/accessToken']).toBeFalsy();
    // 검사: refreshToken이 없어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeFalsy();
  });
});

describe('#5 [Vuex]Verify:로그아웃 이후', () => {
  test('#5-1 LocalStorage에 저장된 accessToken이 없으므로 인증 실패', async () => {
    // 이벤트: 로그아웃 이후 사용자가 페이지를 리로딩 혹은 새로운 탭을 열어서 서비스를 사용
    // 이에 웹 어플리케이션은 localStorage에 저장된 accessToken을 서버에 verify 시도
    await store.dispatch('auth/verifyToken');
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: loggedIn이 false 이어야 합니다.
    expect(store.getters['auth/loggedIn']).toBeFalsy();
    // 검사: accessToken이 있어야 합니다.
    expect(store.getters['auth/accessToken']).toBeFalsy();
    // 검사: refreshToken이 있어야 합니다.
    expect(store.getters['auth/refreshToken']).toBeFalsy();    
  });
});