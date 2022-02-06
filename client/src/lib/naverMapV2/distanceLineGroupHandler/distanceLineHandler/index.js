import {
  add,
  subtract,
  divide,
} from 'mathjs';
import utils from '../../lib/utils';
import naverMapWrapper from '../../lib/naverMapWrapper';
import {
  OVERLAY_STATUS,
} from '../../lib/constants';
import overlayEventHandler from '../../overlayEventHandler';

const createPath = (start, end) => ([
  naverMapWrapper.getLatLng(start.lat, start.lng),
  naverMapWrapper.getLatLng(end.lat, end.lng),
]);

const calculateDistanceMarkerPoint = (start, end) => {
  const latDiff = divide(subtract(end.lat, start.lat), 2);
  const lngDiff = divide(subtract(end.lng, start.lng), 2);

  return {
    lat: add(start.lat, latDiff),
    lng: add(start.lng, lngDiff),
  };
};

const distanceMarkerStyles = [
  'display:inline-block;',
  'padding: 1px 5px;',
  'text-align:center;',
  'font-size:.6rem;',
  'color: white;',
  'border-radius: 10px;',
];
const STROKE_COLOR_BLUR = '#757575'; // vuetify:grey darken-1
const STROKE_WEIGTH_BLUR = 4;
const STROKE_OPACITY_BLUR = 0.8;
const FONT_WEIGHT_BLUR = 'normal';
const getPolylineStyleBlur = () => ({
  strokeColor: STROKE_COLOR_BLUR,
  strokeWeight: STROKE_WEIGTH_BLUR,
  strokeOpacity: STROKE_OPACITY_BLUR,
});
const getDistanceMarkerStyleBlur = () => [
  ...distanceMarkerStyles,
  `font-weight: ${FONT_WEIGHT_BLUR};`,
  `background: ${STROKE_COLOR_BLUR};`,
].join('');
const getDistanceMarkerAnchor = () => naverMapWrapper.getPoint(20, 15);
const getDistanceMarkerIconStyleBlur = (distanceInMeter) => ({
  content: `<div style="${getDistanceMarkerStyleBlur()}"><span>${distanceInMeter}m</span></div>`,
  anchor: getDistanceMarkerAnchor(),
});

const STROKE_COLOR_FOCUS = '#f00';
const STROKE_WEIGTH_FOCUS = 8;
const STROKE_OPACITY_FOCUS = 1;
const FONT_WEIGHT_FOCUS = 'bold';
const getPolylineStyleFocus = () => ({
  strokeColor: STROKE_COLOR_FOCUS,
  strokeWeight: STROKE_WEIGTH_FOCUS,
  strokeOpacity: STROKE_OPACITY_FOCUS,
});
const getDistanceMarkerStyleFocus = () => [
  ...distanceMarkerStyles,
  `font-weight: ${FONT_WEIGHT_FOCUS};`,
  `background: ${STROKE_COLOR_FOCUS};`,
].join('');
const getDistanceMarkerIconStyleFocus = (distanceInMeter) => ({
  content: `<div style="${getDistanceMarkerStyleFocus()}"><span>${distanceInMeter}m</span></div>`,
  anchor: getDistanceMarkerAnchor(),
});

class DistanceLine {
  #start

  #end

  #overlayPolyline

  #overlayMarkerDistance

  #overlayPolylineEventController

  #meta

  constructor({
    start,
    end,
    meta = {},
  }) {
    if (!utils.isLatitude(start.lat)) {
      throw new Error(`start.lat:${start.lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(start.lng)) {
      throw new Error(`start.lng:${start.lng} - 유효하지 않음`);
    }
    if (!utils.isLatitude(end.lat)) {
      throw new Error(`end.lat:${end.lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(start.lng)) {
      throw new Error(`end.lng:${end.lng} - 유효하지 않음`);
    }

    this.#start = start;
    this.#end = end;
    this.#meta = meta;

    this.#overlayPolyline = null;
    this.#overlayMarkerDistance = null;

    // 1-2. overlayPolylineEventController 생성
    this.#overlayPolylineEventController = overlayEventHandler.createOverlayEventController({
      onFocus: () => {
        this.focus();
      },
      onBlur: () => {
        this.blur();
      },
      onClick: () => ({}),
      meta: { ...this.#meta },
    });
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    // NOTE: 지도 위에 표시되는 인스턴스는 1개여야 하므로 이전에 인스턴스 내에서 그린 마커가 있다면 지웁니다.
    this.remove();

    // 1-1. polyline 그리기
    // https://navermaps.github.io/maps.js/docs/naver.maps.Polyline.html#toc25__anchor
    const polyline = naverMapWrapper.getPolyline({
      ...getPolylineStyleBlur(),
      clickable: true, // NOTE: 이 옵션이 켜져 있어야 mouseover, mouseout등의 이벤트들 받을 수 있습니다.
      startIcon: naverMapWrapper.pointingIconCircle(),
      endIcon: naverMapWrapper.pointingIconOpenArrow(),
      path: createPath(this.#start, this.#end),
      map,
    });
    this.#overlayPolyline = polyline;

    // 1-2. overlayPolylineEventController의 overlay 설정
    this.#overlayPolylineEventController.setOverlay(this.#overlayPolyline);

    // 2-1. distanceMarker 그리기
    // 거리를 나타내는 위치는 출발과 도착의 중간 위치이어야 합니다.
    const { lat, lng } = calculateDistanceMarkerPoint(this.#start, this.#end);
    const distanceMarkerPoint = naverMapWrapper.getLatLng(lat, lng);

    // 폴리라인의 거리를 미터 단위로 반환합니다.
    const distanceInMeter = Math.round(this.#overlayPolyline.getDistance());
    this.#overlayMarkerDistance = naverMapWrapper.getMarker({
      position: distanceMarkerPoint,
      icon: getDistanceMarkerIconStyleBlur(distanceInMeter),
      map,
    });
  }

  remove() {
    if (this.#overlayPolyline) {
      this.#overlayPolyline.setMap(null);
      this.#overlayPolyline = null;
    }
    if (this.#overlayMarkerDistance) {
      this.#overlayMarkerDistance.setMap(null);
      this.#overlayMarkerDistance = null;
    }
  }

  destroy() {
    this.remove();
    if (this.#overlayPolylineEventController) {
      this.#overlayPolylineEventController.remove();
      this.#overlayPolylineEventController = null;
    }
  }

  /**
   * distanceLine이 그려질 path를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Polyline.html#setPath__anchor
   *
   * @param {object} start - distanceLine의 출발점 좌표. { lat, lng }
   * @param {object} end - distanceLine의 도착점 좌표. { lat, lng }
   *
   * @return {void} 반환값 없음
   */
  setPath(start, end) {
    if (!utils.isLatitude(start.lat)) {
      throw new Error(`start.lat:${start.lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(start.lng)) {
      throw new Error(`start.lng:${start.lng} - 유효하지 않음`);
    }
    if (!utils.isLatitude(end.lat)) {
      throw new Error(`end.lat:${end.lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(start.lng)) {
      throw new Error(`end.lng:${end.lng} - 유효하지 않음`);
    }

    this.#start = start;
    this.#end = end;

    if (!this.#overlayPolyline || !this.#overlayMarkerDistance) {
      return;
    }

    const path = createPath(this.#start, this.#end);
    this.#overlayPolyline.setPath(path);

    const { lat, lng } = calculateDistanceMarkerPoint(this.#start, this.#end);
    this.#overlayMarkerDistance.setPosition(lat, lng);
  }

  /**
   * 마커의 노출 허용 여부를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {boolean} visible - 마커 노출 허용 여부
   *
   * @return {void} 반환값 없음
   */
  setVisible(visible) {
    if (this.marker) {
      this.marker.setVisible(visible);
    }
    if (this.label) {
      this.label.setVisible(visible);
    }
  }

  /**
   * distanceLine을 focus시킵니다.
   *
   * @return {void} 반환값 없음
   */
  focus() {
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }
    if (this.#overlayPolylineEventController.isFocus()) {
      return;
    }

    if (this.#overlayPolyline) {
      this.#overlayPolyline.setStyles({
        ...getPolylineStyleFocus(),
      });
    }
    if (this.#overlayMarkerDistance) {
      const distanceInMeter = Math.round(this.#overlayPolyline.getDistance());
      this.#overlayMarkerDistance.setOptions({
        icon: getDistanceMarkerIconStyleFocus(distanceInMeter),
      });
    }

    this.#overlayPolylineEventController.setStatus(OVERLAY_STATUS.FOCUS);
  }

  /**
   * distanceLine을 blur시킵니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }
    if (this.#overlayPolylineEventController.isBlur()) {
      return;
    }

    if (this.#overlayPolyline) {
      this.#overlayPolyline.setStyles({
        ...getPolylineStyleBlur(),
      });
    }
    if (this.#overlayMarkerDistance) {
      const distanceInMeter = Math.round(this.#overlayPolyline.getDistance());
      this.#overlayMarkerDistance.setOptions({
        icon: getDistanceMarkerIconStyleBlur(distanceInMeter),
      });
    }

    this.#overlayPolylineEventController.setStatus(OVERLAY_STATUS.BLUR);
  }

  /**
   * DistanceLine에 focus 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - focus 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addFocusListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPolylineEventController.addFocusListener(listener);
    return id;
  }

  /**
   * DistanceLine에 focus 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeFocusListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    this.#overlayPolylineEventController.removeFocusListener(id);
  }

  /**
   * DistanceLine에 blur 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - blur 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addBlurListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPolylineEventController.addBlurListener(listener);
    return id;
  }

  /**
   * DistanceLine에 blur 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeBlurListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    this.#overlayPolylineEventController.removeBlurListener(id);
  }
}

export default {
  /**
   * 네이버 맵 위에 출발, 도착 지점을 잇는 선(Naver Polyline)을 표시하는 DistanceLine 인스턴스를 만듭니다.
   *
   * @param {object} map - (required)Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} start - (required)출발 지점. lat, lng의 위치값을 가지는 객체
   * @param {object} end - (required)도착 지점. lat, lng의 위치값을 가지는 객체
   *
   * @return {DistanceLine} DistanceLine 인스턴스 반환
   */
  createDistanceLine({
    start,
    end,
    meta = {},
  }) {
    if (!start || !utils.isLatitude(start.lat) || !utils.isLongitude(start.lng)) {
      throw new Error('start: 유효하지 않음');
    }
    if (!end || !utils.isLatitude(end.lat) || !utils.isLongitude(end.lng)) {
      throw new Error('end: 유효하지 않음');
    }

    return new DistanceLine({
      start,
      end,
      meta,
    });
  },
  /**
   * 네이버 맵 위에 DistanceLine 인스턴스를 그립니다.
   *
   * @param {object} map - (required)Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} distanceLine - (required)DistanceLine 인스턴스
   *
   * @return {void} 반환값 없음
   */
  drawDistanceLine(map, distanceLine) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!distanceLine) {
      throw new Error('distanceLine: 유효하지 않음');
    }

    distanceLine.draw(map);
  },
  removeDistanceLine(distanceLine) {
    if (!distanceLine) {
      throw new Error('distanceLine: 유효하지 않음');
    }

    distanceLine.remove();
  },
};
