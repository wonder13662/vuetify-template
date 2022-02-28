import naverMapHelper from './naverMapHelper';
import * as mapConstants from './lib/constants';

const NAVER_MAPS_SRC_ID = 'naver-map-src';

const setMapHTMLStyle = () => {
  document.getElementsByTagName('html')[0].style = 'overflow: hidden';
};
const removeMapHTMLStyle = () => {
  document.getElementsByTagName('html')[0].style = '';
};

// 네이버 지도 공식 문서
// https://navermaps.github.io/maps.js.ncp/docs/

class NaverMap {
  #clientId

  constructor({
    mapId,
    clientId,
    mapOptions = {},
    onCompleted = () => {},
    onError = () => {},
  }) {
    if (!mapId) {
      throw new Error('mapId가 유효하지 않습니다.');
    }
    if (!clientId) {
      throw new Error('clientId가 유효하지 않습니다.');
    }

    this.map = null;
    this.#clientId = clientId;
    this.mapId = mapId;
    this.mapOptions = mapOptions;

    this.overlays = [];

    this.mapEventListenerOnBoundChanged = null;
    this.mapEventListenerOnZoomChanged = null;
    this.mapEventListenerOnClick = null;
    this.eventListeners = [];
    this.callbacksOnBoundChanged = [];
    this.callbacksOnZoomChanged = [];
    this.callbacksOnClick = [];
    this.onCompleted = onCompleted;
    this.onError = onError;
  }

  async init() {
    try {
      await naverMapHelper.loadScriptNaverMapApiAsync({
        clientId: this.#clientId,
        id: NAVER_MAPS_SRC_ID,
      });
      this.createNaverMapInstance();
    } catch (error) {
      this.onError(error);
    }
  }

  setEventListeners() {
    const {
      callbacksOnBoundChanged,
      callbacksOnZoomChanged,
      callbacksOnClick,
    } = this;
    const {
      eventListenerOnBoundChanged,
      eventListenerOnZoomChanged,
      eventListenerOnClick,
    } = naverMapHelper.setEventListeners({
      map: this.map,
      callbacksOnBoundChanged,
      callbacksOnZoomChanged,
      callbacksOnClick,
    });
    this.eventListeners = [
      eventListenerOnBoundChanged,
      eventListenerOnZoomChanged,
      eventListenerOnClick,
    ];
  }

  draw() {
    this.overlays.forEach((v) => {
      if (v.setNaverMap) {
        // 매번 새로 그려야 하는 부하를 줄이기 위해 naver map 인스턴스르 직접 전달
        v.setNaverMap(this.map);
        return;
      }
      v.draw(this.map);
    });
  }

  createNaverMapInstance() {
    // TODO 아래의 중첩 callback을 async/await으로 바꾸기
    // https://javascript.info/async-await#async-functions
    naverMapHelper.createNaverMapInstance({
      mapId: this.mapId,
      mapOptions: this.mapOptions,
      onCreated: (map) => {
        try {
          // TODO 이 코드의 역할을 찾아서 메서드로 분리하자.
          setMapHTMLStyle();
          this.map = map;
          this.setEventListeners(map);
          this.onCompleted();
          this.draw();
        } catch (error) {
          this.onError(error);
        }
      },
    });
  }

  // TODO 여러 Overlay 객체 중에서 몇가지만 특정 시점에 그려야 한다면? Map 객체를 넘겨받고, 그리는 시점(맵이 완료된 시점)은 각자 알아서? 고민해보자.

  /**
   * 네이버 맵 위에 그리거나 지울수 있는 객체인 overlay의 배열을 추가합니다.
   *
   * @param {array} overlays - overlay 타입의 인스턴스
   *
   * @return {void} 반환값 없음
   */
  addOverlays(overlays) {
    try {
      if (!overlays || overlays.length === 0) {
        throw new Error('overlays: 유효하지 않음');
      }
      const foundWrong = overlays.find(({ draw, setNaverMap, remove }) => {
        // 1. draw, setNaverMap 중에서 하나는 반드시 구현해야 합니다.
        if (!draw && !setNaverMap) {
          return true;
        }
        // 2. remove는 반드시 구현해야 합니다.
        if (!remove) {
          return true;
        }
        return false;
      });
      if (foundWrong) {
        throw new Error('overlays 객체는 반드시 draw, remove 메서드를 구현해야 합니다');
      }
      // 1. 새로 추가된 overlays는 기존 배열에 추가된다.
      this.overlays = [
        ...this.overlays,
        ...overlays,
      ];
      // 2. 새로 추가된 overlays만 화면에 그려진다.
      const { map } = this;
      if (!map) {
        return;
      }
      overlays.forEach((v) => {
        if (v.setNaverMap) {
          v.setNaverMap(map);
          return;
        }
        v.draw(map);
      });
    } catch (error) {
      this.onError(error);
    }
  }

  /**
   * 네이버 맵 위에 그리거나 지울수 있는 객체인 overlay의 배열을 지도에서 모두 지웁니다.
   *
   * @param {array} overlays - overlay 타입의 인스턴스
   *
   * @return {void} 반환값 없음
   */
  removeOverlays() {
    try {
      this.overlays.forEach((v) => v.remove());
      this.overlays = [];
    } catch (error) {
      this.onError(error);
    }
  }

  fitBounds(bound) {
    const { map } = this;
    if (!map) {
      return;
    }
    try {
      naverMapHelper.fitBounds({
        map,
        bound,
      });
    } catch (error) {
      this.onError(error);
    }
  }

  addCallbackOnBoundChanged(callback) {
    if (!callback) return;
    this.callbacksOnBoundChanged.push(callback);
  }

  addCallbackOnZoomChanged(callback) {
    if (!callback) return;
    this.callbacksOnZoomChanged.push(callback);
  }

  addCallbackOnClick(callback) {
    if (!callback) return;
    this.callbacksOnClick.push(callback);
  }

  destroy() {
    try {
      removeMapHTMLStyle();
      naverMapHelper.removeEventListener(this.eventListeners);
      // TODO 등록된 overlays를 한꺼번에 삭제하는 방법은?
      if (!this.map) throw new Error('네이버 맵 객체가 유효하지 않습니다.');
      // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html
      this.map.destroy();
    } catch (error) {
      this.onError(error);
    }
  }
}

export { default as distanceLineGroupHandler } from './distanceLineGroupHandler'; // REMOVE ME
export { default as distanceLineHandler } from './distanceLineHandler';
export { default as hexagonGroupHandler } from './hexagonGroupHandler';
export { default as hexagonHandler } from './hexagonHandler';
export { default as markerGroupHandler } from './markerGroupHandler'; // REMOVE ME
export { default as markerHandler } from './markerHandler';
export { default as polygonHandler } from './polygonHandler';
export { default as pickupDropPointHandler } from './pickupDropPointHandler';
export { default as pointMarkerHandler } from './pointMarkerHandler';
export { default as polygonLassoHandler } from './polygonLassoHandler';
export { default as hexagonLassoHandler } from './hexagonLassoHandler';
export { default as mapUtils } from './lib/utils';
export { default as boundHandler } from './lib/boundHandler';
export const constants = mapConstants;

export default {
  createNaverMap: ({
    mapId,
    clientId,
    mapOptions = {},
    onCompleted = () => {},
    onError = () => {},
  }) => (new NaverMap({
    mapId,
    clientId,
    mapOptions,
    onCompleted,
    onError,
  })),
};
