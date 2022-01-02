import {
  ERROR__ADD_ERROR,
  ERROR__CLEAR_ERRORS,
} from '@/store/mutationTypes';

export default {
  addError({ commit }, payload) {
    commit(ERROR__ADD_ERROR, payload);
  },
  clearErrors({ commit }) {
    commit(ERROR__CLEAR_ERRORS);
  },
};
