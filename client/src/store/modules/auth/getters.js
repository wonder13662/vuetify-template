export default {
  loggedIn(state) {
    return !!state.user.accessToken;
  },
  accessToken(state) {
    return state.user.accessToken;
  },
  refreshToken(state) {
    return state.user.refreshToken;
  },
};
