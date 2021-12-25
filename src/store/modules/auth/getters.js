export default {
  loggedIn(state) {
    return !!state.user.accessToken;
  },
  permissions(state) {
    return state.user.permissions;
  },
  accessToken(state) {
    return state.user.accessToken;
  },
  refreshToken(state) {
    return state.user.refreshToken;
  },
};
