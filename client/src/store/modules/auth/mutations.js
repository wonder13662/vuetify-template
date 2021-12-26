import jwt from 'jsonwebtoken';

export default {
  AUTH__SET_USER_DATA(state, payload) {
    const {
      accessToken, refreshToken,
    } = payload;
    const decoded = jwt.decode(accessToken);
    const { serviceUserId, permissions, role } = decoded;

    state.user = {
      accessToken,
      refreshToken,
      serviceUserId,
      permissions,
      role,
    };
  },
  AUTH__CLEAR_USER_DATA(state) {
    state.user = {
      accessToken: null,
      refreshToken: null,
      serviceUserId: null,
      permissions: null,
      role: null,
    };
  },
};
