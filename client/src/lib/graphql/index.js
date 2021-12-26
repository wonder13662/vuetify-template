import _apolloClient from './apolloClient';

export default {
  initialize() {
    _apolloClient.initialize();
  },
  stop() {
    _apolloClient.stop();
  },
};

export const apolloClient = _apolloClient;
