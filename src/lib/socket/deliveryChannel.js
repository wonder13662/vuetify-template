import socketClient from '@/lib/socket/socketClient';
import {
  SOCKET_EVENT_COMMON_CLIENT,
  SOCKET_EVENT_DELIVERY_CHANNEL_NAME,
  SOCKET_EVENT_DELIVERY_CHANNEL_ROOM,
  RESOURCE_DELIVERY,
  RESOURCE_SUBDELIVERY,
  RESOURCE_CSTICKET,
} from '@/lib/constants';
import resourceWatcher from '@/lib/socket/resourceWatcher';
import store from '@/store';

/* eslint-disable no-unused-vars */
let socket;
const setEventListener = (targetSocket) => {
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.ERROR, async (err) => {});
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.CONNECT_ERROR, async (err) => {
    if (err.message === 'Authentication error') {
      /* eslint-disable no-param-reassign */
      targetSocket.auth.token = localStorage.getItem(process.env.VUE_APP_AUTH_ACCESS_TOKEN);
      targetSocket.connect();
    }
  });
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.RECONNECT_ERROR, async (err) => {});
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.RECONNECT_FAILED, async (err) => {});
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.CONNECT_TIMEOUT, async (timeout) => {});
  targetSocket.on(SOCKET_EVENT_COMMON_CLIENT.CONNECT, async (data) => {});

  // 비즈니스 로직 이벤트 작성
  targetSocket.on(SOCKET_EVENT_DELIVERY_CHANNEL_ROOM.ROOM_DISPATCH, async (msg) => {
    if (resourceWatcher.has(RESOURCE_DELIVERY)) {
      // TODO 관련 구현 내용 아직 없음
    }
  });

  // TODO (완료)1. map을 사용하지 않고 path로 구분하지 않는 형태로 수정
  // TODO 2. 1번이 완료되면, map을 사용하는 형태로 변경 및 평가. 1번으로 쓸지 말지 결정하자.

  targetSocket.on(SOCKET_EVENT_DELIVERY_CHANNEL_ROOM.ROOM_SUB_DELIVERY_GRAB, async (msg) => {
    const {
      subDeliveryId,
      deliveryId,
      status: subDeliveryStatus,
    } = msg;

    if (resourceWatcher.has(RESOURCE_DELIVERY)) {
      await store.dispatch('deliveryDetail/fetchOne', { id: deliveryId });
    }
    if (resourceWatcher.has(RESOURCE_SUBDELIVERY)) {
      await store.dispatch('subDeliveryDetail/fetchOne', { id: subDeliveryId });
    }
    if (resourceWatcher.has(RESOURCE_CSTICKET)) {
      await store.dispatch('customerServiceTicket/onSubDeliveryStatusUpdated', {
        subDeliveryId,
        subDeliveryStatus,
      });
    }
  });
};

export default {
  initialize() {
    // 1. socket 인스턴스가 없다면 새로 만든다.
    if (!socket) {
      socket = socketClient.create(SOCKET_EVENT_DELIVERY_CHANNEL_NAME);
      setEventListener(socket);
    }
    // 2. socket 인스턴스가 connected 상태가 아니라면 connect 한다.
    if (!socket.connected) {
      socket.connect();
    }
  },
  disconnect() {
    if (socket && !socket.disconnected) {
      // https://socket.io/docs/v4/client-api/#socket-disconnect
      // socket을 일시적으로 연결을 끊는다. (ex: 로그아웃 시의 상황에 필요하다.)
      socket.disconnect();
    }
  },
};
