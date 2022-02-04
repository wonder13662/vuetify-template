import {
  add,
  subtract,
  divide,
} from 'mathjs';
import utils from '../../lib/utils';
import naverMapWrapper from '../../lib/naverMapWrapper';

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
].join();
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
].join();
const getDistanceMarkerIconStyleFocus = (distanceInMeter) => ({
  content: `<div style="${getDistanceMarkerStyleFocus()}"><span>${distanceInMeter}m</span></div>`,
  anchor: getDistanceMarkerAnchor(),
});


class DistanceLine {
  constructor({
    start,
    end,
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

    this.start = start;
    this.end = end;

    this.polyline = null;
    this.distanceMarker = null;
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    // NOTE: 지도 위에 표시되는 인스턴스는 1개여야 하므로 이전에 인스턴스 내에서 그린 마커가 있다면 지웁니다.
    this.remove();

    // https://navermaps.github.io/maps.js/docs/naver.maps.Polyline.html#toc25__anchor
    this.polyline = naverMapWrapper.getPolyline({
      ...getPolylineStyleBlur(),
      startIcon: naverMapWrapper.pointingIconCircle(),
      endIcon: naverMapWrapper.pointingIconOpenArrow(),
      path: createPath(this.start, this.end),
      map,
    });

    // 거리를 나타내는 위치는 출발과 도착의 중간 위치이어야 합니다.
    const { lat, lng } = calculateDistanceMarkerPoint(this.start, this.end);
    const distanceMarkerPoint = naverMapWrapper.getLatLng(lat, lng);

    // 폴리라인의 거리를 미터 단위로 반환합니다.
    const distanceInMeter = Math.round(this.polyline.getDistance());
    this.distanceMarker = naverMapWrapper.getMarker({
      position: distanceMarkerPoint,
      icon: getDistanceMarkerIconStyleBlur(distanceInMeter),
      map,
    });
  }

  remove() {
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    if (this.distanceMarker) {
      this.distanceMarker.setMap(null);
      this.distanceMarker = null;
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

    this.start = start;
    this.end = end;

    if (!this.polyline || !this.distanceMarker) {
      return;
    }

    const path = createPath(this.start, this.end);
    this.polyline.setPath(path);

    const { lat, lng } = calculateDistanceMarkerPoint(this.start, this.end);
    this.distanceMarker.setPosition(lat, lng);
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
    if (this.polyline) {
      this.polyline.setStyles({
        ...getPolylineStyleFocus(),
      });
    }
    if (this.distanceMarker) {
      const distanceInMeter = Math.round(this.polyline.getDistance());
      this.distanceMarker.setOptions({
        icon: getDistanceMarkerIconStyleFocus(distanceInMeter),
      });
    }
  }

  /**
   * distanceLine을 blur시킵니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    if (this.polyline) {
      this.polyline.setStyles({
        ...getPolylineStyleBlur(),
      });
    }
    if (this.distanceMarker) {
      const distanceInMeter = Math.round(this.polyline.getDistance());
      this.distanceMarker.setOptions({
        icon: getDistanceMarkerIconStyleBlur(distanceInMeter),
      });
    }
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
    });
  },
  /**
   * 네이버 맵 위에 DistanceLine 인스턴스를 그립니다.
   *
   * @param {object} map - (required)Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} distacneLine - (required)DistanceLine 인스턴스
   *
   * @return {void} 반환값 없음
   */
  drawDistanceLine(map, distacneLine) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!distacneLine) {
      throw new Error('distacneLine: 유효하지 않음');
    }

    distacneLine.draw(map);
  },
  removeDistanceLine(distacneLine) {
    if (!distacneLine) {
      throw new Error('distacneLine: 유효하지 않음');
    }

    distacneLine.remove();
  },
};
