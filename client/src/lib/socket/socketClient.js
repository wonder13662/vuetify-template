import { Manager } from 'socket.io-client';

let manager;

export default {
  /**
   * Socket.io 인스턴스를 만듬
   * @param {string} channelName - socket의 namespace. Leo에서는 channel이라고 부름.
   *
   * @return {null} 반환 객체 없음
   */
  create(channelName) {
    if (!manager) {
      manager = new Manager(process.env.VUE_APP_WEB_SOCKET, {
        transports: ['websocket'],
      });
    }

    return manager.socket(`/${channelName}`, {
      auth: {
        token: localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN),
      },
    });
  },
};
