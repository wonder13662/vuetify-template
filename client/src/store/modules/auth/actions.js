import services from '@/services';
import {
  AUTH__SET_USER_DATA,
  AUTH__CLEAR_USER_DATA,
} from '@/store/mutationTypes';
import { rules } from '@/lib/utils';
import i18n from '@/plugins/vueI18n';

export default {
  async signIn({ commit, dispatch }, { email, password }) {
    try {
      if (!rules.isValidEmail(email)) {
        throw new Error(`email:${email}/${i18n.t('common.error.notValidValue')}`);
      }
      if (!rules.isValidPassword(password)) {
        throw new Error(`password:${password}/${i18n.t('common.error.notValidValue')}`);
      }

      const {
        accessToken,
        refreshToken,
      } = await services.rest.auth.postSignIn({ email, password });
      commit(AUTH__SET_USER_DATA, {
        accessToken,
        refreshToken,
      });
      localStorage.setItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN, accessToken);
      localStorage.setItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN, refreshToken);
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  async verifyToken({ commit, dispatch }) {
    const accessToken = localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
    if (!accessToken) {
      dispatch('signOut');
      return;
    }

    const {
      isVerified,
    } = await services.rest.auth.verifyTokenInLocalStorage();
    if (!isVerified) {
      dispatch('signOut');
      return;
    }

    const refreshToken = localStorage.getItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
    commit(AUTH__SET_USER_DATA, {
      accessToken,
      refreshToken,
    });
  },
  signOut({ commit }) {
    commit(AUTH__CLEAR_USER_DATA);
    localStorage.removeItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
    localStorage.removeItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
  },
};
