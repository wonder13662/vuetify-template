import axios from 'axios';

export default {
  initialize(
    defaultConfig,
    customConfig,
    requestInterceptorOnSuccess,
    requestInterceptorOnFail,
    responseInterceptorOnSuccess,
    responseInterceptorOnFail,
  ) {
    // https://axios-http.com/docs/req_config
    const instance = axios.create({
      ...defaultConfig,
      ...customConfig,
    });

    // https://axios-http.com/docs/interceptors
    instance.interceptors.request.use(
      requestInterceptorOnSuccess,
      requestInterceptorOnFail,
    );
    instance.interceptors.response.use(
      responseInterceptorOnSuccess,
      responseInterceptorOnFail,
    );

    const getInstance = () => {
      if (!instance) {
        throw new Error('Axios 인스턴스가 없습니다.');
      }
      return instance;
    };

    return {
      async get() {
        throw new Error('get 메서드는 아직 구현되지 않았습니다.');
      },
      /**
       * Http post method by Axios
       * @param {string} url - post method를 호출할 서버의 url-path
       * @param {object} data - payload
       *
       * @return {object} response
       */
      async post(url, data) {
        const result = await getInstance().post(url, data);
        return result;
      },
      async put() {
        throw new Error('put 메서드는 아직 구현되지 않았습니다.');
      },
      async delete() {
        throw new Error('delete 메서드는 아직 구현되지 않았습니다.');
      },
      convertAuthTokenFormatJWT(token) {
        return `Bearer ${token}`;
      },
    };
  },
};
