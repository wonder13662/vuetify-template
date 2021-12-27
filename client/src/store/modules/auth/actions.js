import services from '@/services';
import {
  AUTH__SET_USER_DATA,
  AUTH__CLEAR_USER_DATA,
} from '@/store/mutationTypes';

export default {
  async signIn({ commit, dispatch }, { email, password }) {
    // TODO email, password 유효성 검사
    const response = await services.rest.auth.postSignIn({ email, password });
    const {
      status,
      data: {
        accessToken,
        refreshToken,
      },
    } = response;
    if (status !== 200) {
      const error = new Error(`${email} : 로그인이 실패했습니다.`); // TODO i18n 추가
      dispatch('error/addError', error, { root: true });
      return;
    }

    commit(AUTH__SET_USER_DATA, {
      accessToken,
      refreshToken,
    });
    localStorage.setItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN, accessToken);
    localStorage.setItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN, refreshToken);
  },
  async verifyToken({ commit }) {
    const {
      isVerified,
      accessToken,
      refreshToken,
    } = await services.rest.auth.verifyTokenInLocalStorage();

    if (isVerified) {
      commit(AUTH__SET_USER_DATA, {
        accessToken,
        refreshToken,
      });
    }
  },
  async signOut({ commit }) {
    commit(AUTH__CLEAR_USER_DATA);
    localStorage.removeItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
    localStorage.removeItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
  },
  setUser({ commit }, userData) {
    commit(AUTH__SET_USER_DATA, userData);
  },
};
