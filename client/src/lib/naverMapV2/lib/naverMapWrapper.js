import utils from './utils';
import {
  MAX_ZOOM,
  MIN_ZOOM_POLYGON_VISIBLE,
} from './constants';

// 네이버 지도 Api를 wrapper로 감싼 이유
// 1. naver 네임스페이스가 window.naver로 global 접근이 가능함.
// 그러므로 이 글로벌 변수의 접점을 최대한 출여야 함.
// 2. 지도에 직접 어떤 변화를 주기 위해서는 naver 네임스페이스를 사용해야 함.
// 이런 경우, 각 모듈별로 글로별 변수를 제어해야 하는 문제가 있음.
// 3. naver 네임스페이스는 script tag를 추가해서 동적으로 추가되는 참조임.
// 그러므로 어떤 시점에는 없을 수도 있음. 이런 예외 상황을 한곳에서 관리하는 것이 필요했음.

const getNaver = () => {
  const { naver } = window;
  if (!naver) {
    throw new Error('naver: 유효하지 않음');
  }
  return naver;
};

export default {
  /**
   * Naver Size 클래스의 인스턴스를 반환합니다.
   * Naver Size 클래스는 2차원 평면의 크기를 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Size.html
   *
   * @param {number} width - 너비
   * @param {number} height - 높이
   *
   * @return {object} Naver Size 클래스의 인스턴스
   */
  getSize(width, height) {
    const naver = getNaver();
    return new naver.maps.Size(width, height);
  },
  /**
   * Naver Point 클래스의 인스턴스를 반환합니다.
   * Naver Point 클래스는 2차원 평면의 좌표를 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Point.html
   *
   * @param {number} x - x 좌표
   * @param {number} y - y 좌표
   *
   * @return {object} Naver Point 클래스 인스턴스
   */
  getPoint(x, y) {
    const naver = getNaver();
    return new naver.maps.Point(x, y);
  },
  /**
   * Naver LatLng 클래스의 인스턴스를 반환합니다.
   * Naver LatLng 클래스는 위/경도 좌표를 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.LatLng.html
   *
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   *
   * @return {object} LatLng 클래스 인스턴스
   */
  getLatLng(lat, lng) {
    if (!utils.isLatitude(lat)) {
      throw new Error(`lat:${lat}: 유효하지 않음`);
    }
    if (!utils.isLongitude(lng)) {
      throw new Error(`lng:${lng}: 유효하지 않음`);
    }

    const naver = getNaver();
    return new naver.maps.LatLng(lat, lng);
  },
  /**
   * Naver LatLngBounds 클래스의 인스턴스를 반환합니다.
   * Naver LatLngBounds 클래스는 남서쪽과 북동쪽의 위/경도 좌표가 설정돼 있는 직사각형의 지리적 영역(이하 좌표 경계)을 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.LatLngBounds.html
   *
   * @param {object} sw - 남서쪽의 LatLng 클래스 인스턴스
   * @param {object} ne - 북동쪽의 LatLng 클래스 인스턴스
   *
   * @return {object} Naver LatLngBounds 클래스 인스턴스
   */
  getLatLngBounds(sw, ne) {
    if (!sw) {
      throw new Error('sw: 유효하지 않음');
    }
    if (!ne) {
      throw new Error('sw: 유효하지 않음');
    }

    const naver = getNaver();
    return new naver.maps.LatLngBounds(sw, ne);
  },
  /**
   * Naver Polyline 클래스의 인스턴스를 반환합니다.
   * Naver Polyline 클래스는 폴리라인을 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polyline.html
   *
   * @param {object} options - 도형 옵션
   *
   * @return {object} Naver Polyline 클래스의 인스턴스
   */
  getPolyline(options = {}) {
    const naver = getNaver();
    return new naver.maps.Polyline(options);
  },
  /**
   * Naver Polygon 클래스의 인스턴스를 반환합니다.
   * Naver Polygon 클래스는 폴리곤을 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html
   *
   * @param {object} options - 도형 옵션
   *
   * @return {object} Naver Polygon 클래스의 인스턴스
   */
  getPolygon(options = {}) {
    const naver = getNaver();
    return new naver.maps.Polygon(options);
  },
  /**
   * Naver Marker 클래스의 인스턴스를 반환합니다.
   * Naver Marker 클래스는 지도 위에 올리는 마커를 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Marker.html
   *
   * @param {object} options - 마커 옵션. 이때 position 속성은 반드시 설정해야 합니다.
   *
   * @return {object} Naver Marker 클래스의 인스턴스
   */
  getMarker(options = {}) {
    const naver = getNaver();
    return new naver.maps.Marker(options);
  },
  /**
   * Naver InfoWindow 클래스의 인스턴스를 반환합니다.
   * Naver InfoWindow 클래스는 지도 위에 올리는 정보 창을 정의합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.InfoWindow.html
   *
   * @param {object} options - 정보 창 옵션.
   *
   * @return {object} Naver InfoWindow 클래스의 인스턴스
   */
  getInfoWindow(options = {}) {
    const naver = getNaver();
    return new naver.maps.InfoWindow(options);
  },
  /**
   * 대상 객체에서 이벤트 알림을 받아 핸들러를 호출하는 리스너를 등록합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Event.html#-static-addListener__anchor
   *
   * @param {object} target - 이벤트 대상 객체
   * @param {string} eventName - 이벤트 이름
   * @param {function} listener - 이벤트 리스너
   *
   * @return {MapEventListener} Naver 이벤트 리스닝 객체
   */
  addListener(target, eventName, listener) {
    const naver = getNaver();
    return naver.maps.Event.addListener(target, eventName, listener);
  },
  /**
   * 특정 이벤트 알림의 리스너를 제거합니다
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Event.html#-static-removeListener__anchor
   *
   * @param {object|array} listeners - 이벤트 리스닝 객체 또는 이벤트 리스닝 객체의 배열
   *
   * @return {void} 반환값 없음
   */
  removeListener(listeners) {
    const naver = getNaver();
    return naver.maps.Event.removeListener(listeners);
  },
  /**
   * Naver Map 클래스는 애플리케이션에서 지도 인스턴스를 정의합니다.
   * 이 객체를 생성함으로써 개발자는 지정한 DOM 요소에 지도를 삽입할 수 있습니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html
   *
   * @param {string|HTMLElement} mapDiv - 지도를 삽입할 HTML 요소 또는 HTML 요소의 id
   * @param {object} mapOptions - 지도의 옵션 객체
   *
   * @return {object} Naver Map 클래스의 인스턴스
   */
  getMap(mapDiv, mapOptions) {
    const naver = getNaver();
    return new naver.maps.Map(mapDiv, mapOptions);
  },
  /**
   * 대상 객체에서 한 번만 이벤트 알림을 받아 핸들러를 호출하는 리스너를 등록합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Event.html#-static-once__anchor
   *
   * @param {object} target - 이벤트 대상 객체
   * @param {string} eventName - 이벤트 이름
   * @param {function} listener - 이벤트 리스너
   *
   * @return {MapEventListener} 이벤트 리스닝 객체
   */
  once(target, eventName, listener) {
    const naver = getNaver();
    // FIX ME 주석처리한 구문의 문제를 해결할 방법은? 임시로 return을 추가하면 해결됨.
    // naver.maps.Event.once(target, eventName, listener); // Dependency cycle detected 발생
    return naver.maps.Event.once(target, eventName, listener);
  },
  /**
   * PointingIcon 객체는 폴리라인의 끝 점의 강조 아이콘을 사전에 정의한 것입니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#toc10__anchor
   * OPEN_ARROW | BLOCK_ARROW | CIRCLE | DIAMOND
   *
   * @return {string} PointingIcon.OPEN_ARROW
   */
  pointingIconOpenArrow() {
    const naver = getNaver();
    return naver.maps.PointingIcon.OPEN_ARROW;
  },
  /**
   * 지도 위에 polygon을 그립니다.
   *
   * @param {object} map naver map 인스턴스
   * @param {array} naverPolygonPaths naver map polygon path 배열
   * @param {object} style naver map polygon에 적용할 css 스타일
   *
   * @return {object} 네이버 맵 오버레이 폴리곤 인스턴스
   */
  drawPolygon({
    map,
    naverPolygonPaths,
    visible = true,
    style = {},
    onMouseover = () => {},
    onMouseout = () => {},
    onClick = () => {},
  }) {
    if (!map) {
      throw new Error('map: 유효하지 않습니다.');
    }
    if (!naverPolygonPaths || naverPolygonPaths.length === 0) {
      throw new Error('naverPolygonPaths: 유효하지 않습니다.');
    }

    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-polygon-simple.example.html
    /* eslint-disable no-new */
    const polygon = this.getPolygon({
      map,
      paths: naverPolygonPaths,
      visible,
      clickable: true,
      ...style,
    });

    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-UI-Event.html
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-event-overlay.example.html
    const listeners = [];
    listeners.push(this.addListener(polygon, 'mouseover', (e) => {
      onMouseover(e);
    }));
    listeners.push(this.addListener(polygon, 'mouseout', (e) => {
      onMouseout(e);
    }));
    listeners.push(this.addListener(polygon, 'click', (e) => {
      onClick(e);
    }));

    return {
      polygon,
      listeners,
    };
  },
  /**
   * 지도 위에 polygon을 지웁니다.
   *
   * @param {object} polygon naver map polygon 인스턴스
   * @param {array} listeners naver map polygon의 이벤트 리스너의 배열
   *
   * @return {void} 없음
   */
  removePolygon({
    polygon,
    listeners = [],
  }) {
    if (!polygon) {
      throw new Error('polygon: 유효하지 않습니다.');
    }

    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setMap__anchor
    polygon.setMap(null);
    this.removeListener(listeners);
  },
  /**
   * Naver map에서 H3 polygon을 표시할 수 있는 zoom level인지 판단합니다.
   *
   * @return {boolean} 표시 가능 zoom level 플래그 값
   */
  isZoomLevelPolygonVisible(zoomLevel) {
    const isEOGThanMinZoom = zoomLevel >= MIN_ZOOM_POLYGON_VISIBLE;
    const isEOLThanMaxZoom = zoomLevel <= MAX_ZOOM;

    return isEOGThanMinZoom && isEOLThanMaxZoom;
  },
};
