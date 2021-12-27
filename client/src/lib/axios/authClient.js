import axiosClient from './axiosClient';

let instance;
export default {
  initialize(
    defaultConfig,
    requestInterceptorOnSuccess,
    requestInterceptorOnFail,
    responseInterceptorOnSuccess,
    responseInterceptorOnFail,
  ) {
    const customConfig = {
      baseURL: process.env.VUE_APP_AUTH_HTTP,
    };

    // https://axios-http.com/docs/interceptors
    const defaultRequestInterceptorOnSuccess = (config) => {
      const accessToken = localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
      return {
        ...config,
        headers: {
          Authorization: instance.convertAuthTokenFormatJWT(accessToken),
        },
      };
    };
    const defaultRequestInterceptorOnFail = (err) => Promise.reject(err);
    const defaultResponseInterceptorOnSuccess = (request) => (request);
    const defaultResponseInterceptorOnFail = (err) => Promise.reject(err);

    instance = axiosClient.initialize(
      defaultConfig,
      customConfig,
      requestInterceptorOnSuccess ?? defaultRequestInterceptorOnSuccess,
      requestInterceptorOnFail ?? defaultRequestInterceptorOnFail,
      responseInterceptorOnSuccess ?? defaultResponseInterceptorOnSuccess,
      responseInterceptorOnFail ?? defaultResponseInterceptorOnFail,
    );
  },
  getInstance() {
    if (!instance) {
      throw new Error('Axios 인스턴스가 없습니다.');
    }

    return instance;
  },
};
