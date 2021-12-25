import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client/core';

let instance = null;

export default {
  initialize() {
    // https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic
    const httpLink = new HttpLink({ uri: process.env.VUE_APP_GRAPHQL_HTTP });
    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      const token = localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
      const authorization = `bearer ${token}`;

      operation.setContext({
        headers: {
          authorization,
        },
      });

      return forward(operation);
    });
    // Response 객체의 결과값을 고쳐서 돌려줍니다.
    // https://www.apollographql.com/docs/react/networking/advanced-http-networking/#modifying-response-data
    const extractDataCallback = (operation, forward) => forward(operation).map((response) => {
      const { operationName } = operation;
      // https://stackoverflow.com/questions/455338/how-do-i-check-if-an-object-has-a-key-in-javascript
      if (response.data && operationName in response.data) {
        /*  eslint-disable no-param-reassign */
        response.data = response.data[operationName];
      }

      if (response.errors && response.errors.length > 0) {
        // TODO CUSTOM_ERROR 객체로 바꿔야 함
        response.error = new Error(response.errors[0].message);
      }

      return response;
    });
    const extractDataLink = new ApolloLink(extractDataCallback);

    // TODO graphql validation 기능 추가
    // https://www.apollographql.com/docs/react/api/core/ApolloClient/
    instance = new ApolloClient({
      // Provide required constructor fields
      cache: new InMemoryCache(),
      link: concat(authMiddleware, extractDataLink.concat(httpLink)),
      // https://www.apollographql.com/docs/react/api/core/ApolloClient/#example-defaultoptions-object
      // https://www.apollographql.com/docs/react/api/core/ApolloClient/#FetchPolicy
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  },
  getInstance() {
    if (!instance) {
      // TODO CustomError 가져오기
      throw new Error('apollo client 인스턴스가 없습니다.');
    }
    return instance;
  },
  stop() {
    if (!instance) {
      return;
    }
    // https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.stop
    instance.stop();
    instance = null;
  },
};
