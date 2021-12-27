import jwt from 'jsonwebtoken';

export default {
  AUTH__SET_USER_DATA(state, payload) {
    const {
      accessToken, refreshToken,
    } = payload;
    const decoded = jwt.decode(accessToken);
    const { serviceUserId, role } = decoded; // TODO 이 정보는 받도록 해주자.

    state.user = {
      accessToken,
      refreshToken,
      serviceUserId,
      role,
    };
  },
  AUTH__CLEAR_USER_DATA(state) {
    state.user = {
      accessToken: null,
      refreshToken: null,
      serviceUserId: null,
      role: null,
    };
  },
};
