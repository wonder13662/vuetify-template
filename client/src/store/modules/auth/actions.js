import services from '@/services';
import {
  AUTH__SET_USER_DATA,
  AUTH__CLEAR_USER_DATA,
} from '@/store/mutationTypes';

export default {
  async signIn({ commit }, credentials) {
    const response = await services.rest.auth.postSignIn(credentials);
    const {
      data: {
        accessToken,
        refreshToken,
      },
    } = response;
    commit(AUTH__SET_USER_DATA, {
      accessToken,
      refreshToken,
    });
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
  },
  setUser({ commit }, userData) {
    commit(AUTH__SET_USER_DATA, userData);
  },
};
