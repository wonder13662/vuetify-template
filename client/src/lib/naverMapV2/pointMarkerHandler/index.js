import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../overlayEventHandler';
import {
  OVERLAY_STATUS,
} from '../lib/constants';
import mapUtils from '../lib/utils';

const MODE_ENABLED_SELECTED = 'MODE_ENABLED_SELECTED';
const MODE_ENABLED_UNSELECTED = 'MODE_ENABLED_UNSELECTED';
const MODE_DISABLED_SELECTED = 'MODE_DISABLED_SELECTED';
const MODE_DISABLED_UNSELECTED = 'MODE_DISABLED_UNSELECTED';

const getStyleModeSelected = () => [
  'width: 8px;',
  'height: 8px;',
  'border: solid 4px black;',
];
const getStyleModeUnselected = () => [
  'width: 8px;',
  'height: 8px;',
  'border: solid 4px grey;',
];
const getStyleModeEnabled = () => [
  'opacity: 1;',
];
const getStyleModeDisabled = () => [
  'opacity: .5;',
];
const getStyleModeEnabledSelected = () => [
  ...getStyleModeEnabled(),
  ...getStyleModeSelected(),
];
const getStyleModeEnabledUnselected = () => [
  ...getStyleModeEnabled(),
  ...getStyleModeUnselected(),
];
const getStyleModeDisabledSelected = () => [
  ...getStyleModeDisabled(),
  ...getStyleModeSelected(),
];
const getStyleModeDisabledUnselected = () => [
  ...getStyleModeDisabled(),
  ...getStyleModeUnselected(),
];
const getStyle = (mode) => {
  if (mode === MODE_ENABLED_SELECTED) {
    return getStyleModeEnabledSelected();
  }
  if (mode === MODE_ENABLED_UNSELECTED) {
    return getStyleModeEnabledUnselected();
  }
  if (mode === MODE_DISABLED_SELECTED) {
    return getStyleModeDisabledSelected();
  }
  if (mode === MODE_DISABLED_UNSELECTED) {
    return getStyleModeDisabledUnselected();
  }
  return [];
};

const getAnchorModeSelected = () => naverMapWrapper.getPoint(8, 8);
const getAnchorModeUnselected = () => naverMapWrapper.getPoint(8, 8);
const getAnchor = (mode) => {
  if (mode === MODE_ENABLED_SELECTED || mode === MODE_DISABLED_SELECTED) {
    return getAnchorModeSelected();
  }
  if (mode === MODE_ENABLED_UNSELECTED || mode === MODE_DISABLED_UNSELECTED) {
    return getAnchorModeUnselected();
  }
  return [];
};

const getStyleBlur = (mode) => [
  'background: red;',
  ...getStyle(mode),
].join('');

const getPointMarkerIconStyleBlur = (mode) => ({
  content: `<div style="${getStyleBlur(mode)}"></div>`,
  anchor: getAnchor(mode),
});

const getStyleFocus = (mode) => [
  'background: yellow;',
  ...getStyle(mode),
].join('');
const getPointMarkerIconStyleFocus = (mode) => ({
  content: `<div style="${getStyleFocus(mode)}"></div>`,
  anchor: getAnchor(mode),
});

const getPointMarkerIconStyle = (isFocus, mode) => {
  if (isFocus) {
    return getPointMarkerIconStyleFocus(mode);
  }
  return getPointMarkerIconStyleBlur(mode);
};

class PointMarker {
  #point

  #meta

  #overlayPointMarker

  #overlayPolylineEventController

  #mode

  constructor({
    point,
    meta = {},
  }) {
    if (!mapUtils.isLatitude(point.lat)) {
      throw new Error(`point.lat:${point.lat} - 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(point.lng)) {
      throw new Error(`point.lng:${point.lng} - 유효하지 않음`);
    }
    this.#point = point;
    this.#meta = meta;
    this.#overlayPointMarker = null;
    this.#overlayPolylineEventController = overlayEventHandler.createOverlayEventController({
      onFocus: () => {
        this.focus();
      },
      onBlur: () => {
        this.blur();
      },
      onClick: () => {
        this.click();
      },
      meta: { ...this.#meta },
    });
    this.#mode = MODE_ENABLED_UNSELECTED;
  }

  /**
   * 네이버 맵 위에 PointMarker를 그립니다.
   * Overlay 타입의 필수 구현 메서드입니다.
   *
   * @param {object} map - (required)네이버 맵 객체
   *
   * @return {void} 리턴값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    const { lat, lng } = this.#point;
    const position = naverMapWrapper.getLatLng(lat, lng);

    this.#overlayPointMarker = naverMapWrapper.getMarker({
      position,
      icon: getPointMarkerIconStyleBlur(this.#mode),
      map,
    });
    this.#overlayPolylineEventController.setOverlay(this.#overlayPointMarker);
  }

  /**
   * 네이버 맵 위에 PointMarker를 지웁니다. Overlay 타입의 필수 구현 메서드입니다.
   *
   * @return {void} 리턴값 없음
   */
  remove() {
    if (this.#overlayPointMarker) {
      this.#overlayPointMarker.setMap(null);
      this.#overlayPointMarker = null;
    }
  }

  /**
   * PointMarker를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#overlayPolylineEventController) {
      this.#overlayPolylineEventController.remove();
      this.#overlayPolylineEventController = null;
    }
  }

  /**
   * PointMarker를 focus시킵니다.
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

    if (this.#overlayPointMarker) {
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyleFocus(this.#mode),
      });
    }

    this.#overlayPolylineEventController.setStatus(OVERLAY_STATUS.FOCUS);
  }


  /**
   * PointMarker를 blur시킵니다.
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

    if (this.#overlayPointMarker) {
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyleBlur(this.#mode),
      });
    }

    this.#overlayPolylineEventController.setStatus(OVERLAY_STATUS.BLUR);
  }

  /**
   * PointMarker의 click 이벤트를 처리합니다.
   *
   * @return {void} 반환값 없음
   */
  click() {
    if (this.#mode === MODE_DISABLED_SELECTED || this.#mode === MODE_DISABLED_UNSELECTED) {
      return;
    }

    if (this.#mode === MODE_ENABLED_SELECTED) {
      this.#mode = MODE_ENABLED_UNSELECTED;
    } else if (this.#mode === MODE_ENABLED_UNSELECTED) {
      this.#mode = MODE_ENABLED_SELECTED;
    }

    if (this.#overlayPointMarker) {
      const isFocus = this.#overlayPolylineEventController.isFocus();
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyle(isFocus, this.#mode),
      });
    }
  }

  /**
   * PointMarker를 disabled 상태로 바꿉니다
   *
   * @return {void} 반환값 없음
   */
  setDisabled() {
    if (this.#mode === MODE_ENABLED_SELECTED) {
      this.#mode = MODE_DISABLED_SELECTED;
    } else if (this.#mode === MODE_ENABLED_UNSELECTED) {
      this.#mode = MODE_DISABLED_UNSELECTED;
    }

    if (this.#overlayPointMarker) {
      const isFocus = this.#overlayPolylineEventController.isFocus();
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyle(isFocus, this.#mode),
      });
    }
  }

  /**
   * PointMarker를 enabled 상태로 바꿉니다
   *
   * @return {void} 반환값 없음
   */
  setEnabled() {
    if (this.#mode === MODE_DISABLED_SELECTED) {
      this.#mode = MODE_ENABLED_SELECTED;
    } else if (this.#mode === MODE_DISABLED_UNSELECTED) {
      this.#mode = MODE_ENABLED_UNSELECTED;
    }

    if (this.#overlayPointMarker) {
      const isFocus = this.#overlayPolylineEventController.isFocus();
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyle(isFocus, this.#mode),
      });
    }
  }

  /**
   * PointMarker의 mode 값을 돌려줍니다.
   *
   * @return {string} PointMarker의 mode 값
   */
  get mode() {
    return this.#mode;
  }

  /**
   * PointMarker의 meta 값을 돌려줍니다.
   *
   * @return {object} PointMarker의 meta 값
   */
  get meta() {
    return {
      ...this.#meta,
    };
  }

  /**
   * PointMarker의 위치를 설정합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {object} point - lat, lng 속성을 가지는 객체
   *
   * @return {void} 반환값 없음
   */
  setPosition(point) {
    if (!point) {
      throw new Error(`point:${point}/유효하지 않습니다.`);
    }
    if (!mapUtils.isLatitude(point.lat)) {
      throw new Error(`point.lat:${point.lat}/유효하지 않습니다.`);
    }
    if (!mapUtils.isLongitude(point.lng)) {
      throw new Error(`point.lng:${point.lng}/유효하지 않습니다.`);
    }

    this.#point = point;
    const { lat, lng } = this.#point;
    const position = naverMapWrapper.getLatLng(lat, lng);
    this.#overlayPointMarker.setPosition(position);
  }

  /**
   * PointMarker의 위치를 가져옵니다.
   *
   * @return {Point} 위도(lat), 경도(lng) 속성을 가지는 Point 객체
   */
  getPosition() {
    const {
      lat,
      lng,
    } = this.#point;
    return {
      lat,
      lng,
    };
  }

  /**
   * PointMarker가 SELECTED 상태인지 여부를 알려줍니다.
   *
   * @return {boolean} PointMarker가 SELECTED 상태인지 여부
   */
  isSelected() {
    return this.#mode === MODE_ENABLED_SELECTED || this.#mode === MODE_DISABLED_SELECTED;
  }

  /**
   * PointMarker가 UNSELECTED 상태인지 여부를 알려줍니다.
   *
   * @return {boolean} PointMarker가 UNSELECTED 상태인지 여부
   */
  isUnselected() {
    return this.#mode === MODE_ENABLED_UNSELECTED || this.#mode === MODE_DISABLED_UNSELECTED;
  }

  /**
   * PointMarker가 ENABLED 상태인지 여부를 알려줍니다.
   *
   * @return {boolean} PointMarker가 ENABLED 상태인지 여부
   */
  isEnabled() {
    return this.#mode === MODE_ENABLED_SELECTED || this.#mode === MODE_ENABLED_UNSELECTED;
  }

  /**
   * PointMarker가 DISABLED 상태인지 여부를 알려줍니다.
   *
   * @return {boolean} PointMarker가 DISABLED 상태인지 여부
   */
  isDisabled() {
    return this.#mode === MODE_DISABLED_SELECTED || this.#mode === MODE_DISABLED_UNSELECTED;
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

  /**
   * DistanceLine에 click 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPolylineEventController.addClickListener(listener);
    return id;
  }

  /**
   * DistanceLine에 click 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeClickListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayPolylineEventController) {
      throw new Error('this.#overlayPolylineEventController/유효하지 않습니다.');
    }

    this.#overlayPolylineEventController.removeClickListener(id);
  }
}

export default {
  /**
   * 네이버 맵 위에 위도(lat), 경도(lng) 좌표로 한 지점(point)를 나타내는 마커를 그립니다.
   *
   * @param {object} point - (required)위도(lat), 경도(lng) 좌표를 가지고 있는 point 객체
   * @param {object} meta - (optional)pointMarker의 meta 정보
   *
   * @return {PointMarker} PointMarker 인스턴스 반환
   */
  createPointMarker({
    point,
    meta = {},
  }) {
    return new PointMarker({
      point,
      meta,
    });
  },
};
