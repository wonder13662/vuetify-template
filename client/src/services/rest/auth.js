import { authClient } from '@/lib/axios';

export default {
  async postSignIn({ email, password }) {
    const result = await authClient.getInstance().post('/signin', { email, password });
    return result;
  },
  async verifyTokenInLocalStorage() {
    const accessToken = localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
    if (!accessToken) {
      return false;
    }

    const { data: result } = await authClient.getInstance().post('/verify', {
      token: accessToken,
    });

    const isVerified = result && result.statusCode === 200;
    return {
      isVerified,
      accessToken,
      refreshToken: localStorage.getItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN),
    };
  },
};
