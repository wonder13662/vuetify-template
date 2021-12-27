import { authClient } from '@/lib/axios';

export default {
  async postSignIn({ email, password }) {
    const {
      data: {
        accessToken,
        refreshToken,
      },
    } = await authClient.getInstance().post('/signin', { email, password });
    return {
      accessToken,
      refreshToken,
    };
  },
  async verifyTokenInLocalStorage(accessToken) {
    if (!accessToken) {
      return {
        isVerified: false,
      };
    }

    const {
      status,
      data: {
        success,
      },
    } = await authClient.getInstance().post('/verify', {
      token: accessToken,
    });

    return {
      isVerified: status === 200 && success,
    };
  },
};
