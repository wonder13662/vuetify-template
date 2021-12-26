import _authClient from './authClient';

export default {
  initialize() {
    // https://axios-http.com/docs/req_config
    const defaultConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 1000,
      withCredentials: false, // default
      responseType: 'json', // default: json
      responseEncoding: 'utf8', // default
      xsrfCookieName: 'XSRF-TOKEN', // default
      xsrfHeaderName: 'X-XSRF-TOKEN', // default
      validateStatus(status) {
        return status > 0; // service layer를 사용하는 측에서 server code로 error 상황을 판단하도록 한다.
        // return status >= 200 && status < 300; // default
      },
      maxRedirects: 5, // default
    };

    // https://axios-http.com/docs/interceptors
    const requestInterceptorOnSuccess = null;
    const requestInterceptorOnFail = null;
    const responseInterceptorOnSuccess = (response) => ({
      ...response,
      data: response.data && response.data.data ? response.data.data : response.data,
    });
    // https://app.zenhub.com/workspaces/leo-5e77993ea086dcb292e71ab7/issues/barogo/leo/1173
    // TODO 전달받는 에러 코드와 내용이 client마다 다르므로
    // 이를 일관된 client의 ErrorCode로 관리하는 맵이 필요하다.
    // 그리고 이 맵을 거쳐서 store의 에러 스택에 쌓아 관리한다.
    const responseInterceptorOnFail = (err) => Promise.reject(err);

    _authClient.initialize(
      defaultConfig,
      requestInterceptorOnSuccess,
      requestInterceptorOnFail,
      responseInterceptorOnSuccess,
      responseInterceptorOnFail,
    );
  },
};

export const authClient = _authClient;
