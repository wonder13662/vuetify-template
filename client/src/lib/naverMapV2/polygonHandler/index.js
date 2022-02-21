import mapUtils from '../lib/utils';
import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../overlayEventHandler';
import {
  Z_INDEX_POLYGON_BORDER,
} from '../lib/constants';

// TODO HexagonGroupHandler와 HexagonHandler가 이 객체를 사용하도록 변경해야 합니다.

/**
 * Naver map의 폴리곤 경계의 스타일 값을 줍니다.
 * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Data.html#toc25__anchor
 *
 * Vuetify의 deep-purple 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: deep-purple lighten-1 #7E57C2
 * stokeColor: deep-purple darken-1 #5E35B1
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
const getStyleReadUnselectedBlur = () => ({
  fillColor: '#7E57C2',
  fillOpacity: 0.6,
  strokeWeight: 2,
  strokeColor: '#5E35B1',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계의 Focus 시의 스타일 값을 줍니다.
 *
 * Vuetify의 purple 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: purple #9C27B0
 * stokeColor: purple darken-4 #4A148C
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleReadUnselectedFocus = () => ({
  fillColor: '#9C27B0',
  fillOpacity: 0.4,
  strokeWeight: 2,
  strokeColor: '#4A148C',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Blur의 스타일 값을 줍니다.
 * Vuetify의 Orange 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: orange #FF9800
 * stokeColor: orange darken-4 #E65100
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleReadSelectedBlur = () => ({
  fillColor: '#FF9800',
  fillOpacity: 0.4,
  strokeWeight: 2,
  strokeColor: '#E65100',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Focus의 스타일 값을 줍니다.
 * Vuetify의 yellow 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: yellow #FFEB3B
 * stokeColor: yellow darken-4 #F57F17
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleReadSelectedFocus = () => ({
  fillColor: '#FFEB3B',
  fillOpacity: 0.4,
  strokeWeight: 2,
  strokeColor: '#F57F17',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Blur의 스타일 값을 줍니다.
 * Vuetify의 lime 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: grey darken-1 #757575
 * stokeColor: grey darken-2 #616161
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleDisabledBlur = () => ({
  fillColor: '#757575',
  fillOpacity: 0.9,
  strokeWeight: 2,
  strokeColor: '#616161',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Focus의 스타일 값을 줍니다.
 * Vuetify의 lime 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: grey darken-1 #757575
 * stokeColor: grey darken-2 #616161
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleDisabledFocus = () => ({
  fillColor: '#757575',
  fillOpacity: 0.9,
  strokeWeight: 2,
  strokeColor: '#616161',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계가 편집중일 때의 Blur의 스타일 값을 줍니다.
 * Vuetify의 light-green 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: light-green accent-4 #64DD17
 * stokeColor: light-green darken-4 #33691E
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleEditBlur = () => ({
  fillColor: '#64DD17',
  fillOpacity: 0.5,
  strokeWeight: 2,
  strokeColor: '#33691E',
  zIndex: Z_INDEX_POLYGON_BORDER,
});

/**
 * Naver map의 폴리곤 경계가 편집중일 때의 Focus의 스타일 값을 줍니다.
 * Vuetify의 light-green 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: light-green accent-4 #64DD17
 * stokeColor: light-green darken-4 #33691E
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleEditFocus = () => ({
  fillColor: '#64DD17',
  fillOpacity: 0.5,
  strokeWeight: 2,
  strokeColor: '#33691E',
  zIndex: Z_INDEX_POLYGON_BORDER,
});


class Polygon {
  #points

  #meta

  #naverPolygon

  #overlayEventHandler

  /**
   * 좌표를 받아 Naver 폴리곤을 제어(그리기,지우기)하는 Polygon 객체를 만듭니다.
   *
   * @param {array} points - (required)위도(lat), 경도(lng) 속성을 가지는 Point 객체
   * @param {object} meta - (optional)마커의 메타정보
   *
   * @return {Polygon} Polygon의 인스턴스
   */
  constructor({
    points,
    meta = {},
  }) {
    this.#points = points;
    this.#meta = meta;
    this.#naverPolygon = null;
    this.#overlayEventHandler = overlayEventHandler.createOverlayEventController({
      onFocus: () => {
        // this.focus();
      },
      onBlur: () => {
        // this.blur();
      },
      onClick: () => ({}),
      meta: { ...this.#meta },
    });
  }

  /**
   * 네이버 폴리곤을 네이버 지도 객체 위에 그립니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html
   *
   * @param {object} map - (required) 네이버 맵 인스턴스
   *
   * @return {void} 반환값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error(`map:${map}/유효하지 않음`);
    }

    // NOTE: 지도 위에 표시되는 인스턴스는 1개여야 하므로 이전에 인스턴스 내에서 그린 마커가 있다면 지웁니다.
    this.remove();

    const path = this.#points.map((p) => (naverMapWrapper.getLatLng(p.lat, p.lng)));
    this.#naverPolygon = naverMapWrapper.drawPolygonNoListener({
      map,
      naverPolygonPaths: [path],
      style: getStyleReadUnselectedBlur(),
    });
    this.#overlayEventHandler.setOverlay(this.#naverPolygon);
  }

  /**
   * 네이버 폴리곤을 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#naverPolygon) {
      this.#naverPolygon.setMap(null);
      this.#naverPolygon = null;
    }
  }

  /**
   * Polygon 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#overlayEventHandler) {
      this.#overlayEventHandler.remove();
      this.#overlayEventHandler = null;
    }
  }
}

export default {
  createPolygon({
    points,
    meta = {},
  }) {
    if (!points || points.length === 0) {
      throw new Error(`points:${points}/유효하지 않습니다.`);
    }
    points.forEach((p) => {
      if (!mapUtils.isValidPoint(p)) {
        throw new Error(`p:${p}/유효하지 않습니다.`);
      }
    });
    return new Polygon({
      points,
      meta,
    });
  },
};
