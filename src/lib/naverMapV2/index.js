// import hexagonHandler from './hexagonHandler';
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

    this.polylinesOnMap = []; // REMOVE ME
    // this.polylines = []; // TODO hexagonGroups와 동일한 방식으로 제어하도록 수정하자!

    this.markerGroups = [];
    this.distanceLineGroups = [];
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
    markerGroupHandler.drawMarkerGroups({
      map: this.map,
      markerGroups: this.markerGroups,
    });

    distanceLineGroupHandler.drawDistanceLineGroup({
      map: this.map,
      markerGroups: this.distanceLineGroups,
    });

    hexagonGroupHandler.drawHexagonGroups({
      map: this.map,
      hexagonGroups: this.hexagonGroups,
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

      this.hexagonGroups = hexagonGroups;
      this.hexagonGroups.forEach((v) => { // FIX ME - 이거 핸들러로 처리하도록 바꿔야 함
        v.draw(map);
      });
    } catch (error) {
      this.onError(error);
    }
  }

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
    try {
      naverMapHelper.fitBounds({
        map: this.map,
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
