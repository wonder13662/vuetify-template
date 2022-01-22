import naverMapHelper from './naverMapHelper';
import hexagonGroupHandler from './hexagonGroupHandler';
import markerGroupHandler from './markerGroupHandler';
import distanceLineGroupHandler from './distanceLineGroupHandler';

const NAVER_MAPS_SRC_ID = 'naver-map-src';

const setMapHTMLStyle = () => {
  document.getElementsByTagName('html')[0].style = 'overflow: hidden';
};
const removeMapHTMLStyle = () => {
  document.getElementsByTagName('html')[0].style = '';
};

class NaverMap {
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
    this.mapId = mapId;
    this.mapOptions = mapOptions;

    this.overlays = [];
    // @ Deprecated
    this.polylinesOnMap = []; // REMOVE ME
    // this.polylines = []; // TODO hexagonGroups와 동일한 방식으로 제어하도록 수정하자!
    // @ Deprecated
    this.markerGroups = [];
    // @ Deprecated
    this.distanceLineGroups = [];
    // @ Deprecated
    this.hexagonGroups = [];

    this.mapEventListenerOnBoundChanged = null;
    this.mapEventListenerOnZoomChanged = null;
    this.mapEventListenerOnClick = null;
    this.eventListeners = [];
    this.callbacksOnBoundChanged = [];
    this.callbacksOnZoomChanged = [
      (v) => {
        hexagonGroupHandler.setZoomLevel({
          map: this.map,
          hexagonGroups: this.hexagonGroups,
          zoomLevel: v,
        });
      },
    ];
    this.callbacksOnClick = [
      (v) => {
        hexagonGroupHandler.setClickedPoint({
          map: this.map,
          hexagonGroups: this.hexagonGroups,
          point: v,
        });
      },
    ];
    this.onCompleted = onCompleted;
    this.onError = onError;

    try {
      naverMapHelper.loadScriptNaverMapApi({
        clientId,
        document: window.document,
        id: NAVER_MAPS_SRC_ID,
        onLoad: () => {
          const { naver } = window;
          // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#toc9__anchor
          if (naver.maps.jsContentLoaded) {
            this.createNaverMapInstance();
          } else {
            naver.maps.onJSContentLoaded = () => {
              this.naverJSContentLoaded = true;
              this.createNaverMapInstance();
            };
          }
        },
      });
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
    // @ Deprecated
    markerGroupHandler.drawMarkerGroups({
      map: this.map,
      markerGroups: this.markerGroups,
    });
    // @ Deprecated
    distanceLineGroupHandler.drawDistanceLineGroup({
      map: this.map,
      markerGroups: this.distanceLineGroups,
    });
    // @ Deprecated
    hexagonGroupHandler.drawHexagonGroups({
      map: this.map,
      hexagonGroups: this.hexagonGroups,
    });

    this.overlays.forEach((v) => v.draw(this.map));
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
      const found = overlays.find(({ draw, remove }) => !draw || !remove);
      if (found) {
        throw new Error('overlays 객체는 반드시 draw, remove 메서드를 구현해야 합니다');
      }
      // 1. 새로 추가된 overlays는 기존 배열에 추가된다.
      this.overlays = [
        ...this.overlays,
        ...overlays,
      ];
      // 2. 새로 추가된 overlays만 화면에 그려진다.
      const { map } = this;
      if (map) {
        overlays.forEach((v) => v.draw(map));
      }
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

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * 네이버 맵 위에 출발, 도착 지점을 잇는 선들의 집합(DistanceLineGroup)을 그립니다.
   *
   * @param {object} distanceLineGroup - DistanceLineGroup의 인스턴스
   *
   * @return {void} 반환값 없음
   */
  addDistanceLineGroups(distanceLineGroups) { // TODO 얘네들 모두 set으로 바꾸자.
    try {
      const { map } = this;
      if (!map) {
        throw new Error('map: 유효하지 않음');
      }
      if (!distanceLineGroups || distanceLineGroups.length === 0) {
        throw new Error('distanceLine: 유효하지 않음');
      }
      this.distanceLineGroups = distanceLineGroups;
      distanceLineGroupHandler.drawDistanceLineGroup({
        map,
        distanceLineGroups: this.distanceLineGroups,
      });
    } catch (error) {
      this.onError(error);
    }
  }

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * 네이버 맵 위에 출발, 도착 지점을 잇는 선들의 집합(DistanceLineGroup)을 지웁니다.
   *
   * @return {void} 반환값 없음
   */
  removeDistanceLineGroups() {
    try {
      distanceLineGroupHandler.removeDistanceLineGroups(this.distanceLineGroups);
    } catch (error) {
      this.onError(error);
    }
  }

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * MarkerGroup의 인스턴스의 배열을 추가합니다.
   *
   * @param {array} markerGroups - MarkerGroup의 배열
   *
   * @return {void} 반환값 없음
   */
  addMarkerGroups(markerGroups) {
    try {
      const { map } = this;
      if (!map) {
        throw new Error('map: 유효하지 않음');
      }
      if (!markerGroups || markerGroups.length === 0) {
        throw new Error('markerGroups: 유효하지 않음');
      }
      this.markerGroups = markerGroups;
      markerGroupHandler.drawMarkerGroups(this.markerGroups);
    } catch (error) {
      this.onError(error);
    }
  }

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * MarkerGroup의 인스턴스의 배열을 맵 위에서 삭제합니다.
   *
   * @return {void} 반환값 없음
   */
  removeMarkerGroups() {
    try {
      markerGroupHandler.removeMarkerGroups(this.markerGroups);
    } catch (error) {
      this.onError(error);
    }
  }

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * HexagonGroup의 인스턴스의 배열을 추가합니다.
   *
   * @param {array} hexagonGroups - HexagonGroup의 배열
   *
   * @return {void} 반환값 없음
   */
  addHexagonGroups(hexagonGroups) {
    try {
      const { map } = this;
      if (!map) {
        throw new Error('map: 유효하지 않음');
      }
      if (!hexagonGroups || hexagonGroups.length === 0) {
        throw new Error('지도에 그릴 hexagonGroup 정보가 유효하지 않습니다.');
      }

      hexagonGroupHandler.drawHexagonGroups({
        map,
        hexagonGroups,
      });
      this.hexagonGroups = hexagonGroups;
    } catch (error) {
      this.onError(error);
    }
  }

  // @ Deprecated - Overlays를 이용해 지도 위에 그려주세요
  /**
   * HexagonGroup의 인스턴스의 배열을 맵 위에서 삭제합니다.
   *
   * @return {void} 반환값 없음
   */
  removeHexagonGroups() {
    try {
      hexagonGroupHandler.removeHexagonGroups(this.hexagonGroups);
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

      markerGroupHandler.removeMarkerGroups(this.markerGroups);
      this.markerGroups = [];

      distanceLineGroupHandler.removeDistanceLineGroup(this.distanceLineGroups);
      this.distanceLineGroups = [];

      hexagonGroupHandler.removeHexagonGroups(this.hexagonGroups);
      this.hexagonGroups = [];

      if (!this.map) throw new Error('네이버 맵 객체가 유효하지 않습니다.'); // TODO CUSTOM_ERROR, ERROR_CODE 매핑
      // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html
      this.map.destroy();
    } catch (error) {
      this.onError(error);
    }
  }
}

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
