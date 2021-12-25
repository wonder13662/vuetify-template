export default {
  ERROR__ADD_ERROR(state, payload) {
    state.errors.push(payload);
  },
  ERROR__CLEAR_ERRORS(state) {
    state.errors = [];
  },
};
