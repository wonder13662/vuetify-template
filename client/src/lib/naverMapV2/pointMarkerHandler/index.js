import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../overlayEventHandler';
import {
  OVERLAY_STATUS,
} from '../lib/constants';
import mapUtils from '../lib/utils';

// 1. PointMarker Style
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

const getAnchor = () => naverMapWrapper.getPoint(8, 8);

const getStyleBlur = (mode) => [
  'background: red;',
  ...getStyle(mode),
].join('');

const getPointMarkerIconStyleBlur = (mode) => ({
  content: `<div style="${getStyleBlur(mode)}"></div>`,
  anchor: getAnchor(),
});

const getStyleFocus = (mode) => [
  'background: yellow;',
  ...getStyle(mode),
].join('');
const getPointMarkerIconStyleFocus = (mode) => ({
  content: `<div style="${getStyleFocus(mode)}"></div>`,
  anchor: getAnchor(),
});

const getPointMarkerIconStyle = (isFocus, mode) => {
  if (isFocus) {
    return getPointMarkerIconStyleFocus(mode);
  }
  return getPointMarkerIconStyleBlur(mode);
};

// 2. Button Remove Style
const getAnchorBtnRemove = () => naverMapWrapper.getPoint(-14, 8);
const btnRemoveStyles = [
  'position: relative;',
  'width: 16px;',
  'height: 16px;',
  'border-radius: 1rem;',
];
const getStyleBtnRemoveFocus = () => [
  ...btnRemoveStyles,
  'background: black;',
].join('');
const getStyleBtnRemoveBlur = () => [
  ...btnRemoveStyles,
  'background: red;',
].join('');
const getStyleBtnRemoveInnerText = () => [
  'color: white;',
  'position: absolute;',
  'left: 4px;',
  'top: -4px;',
  'font-size: 1rem;',
].join('');
const getBtnRemoveIconFocus = () => ({
  content: [
    `<div style="${getStyleBtnRemoveFocus()}">`,
    `<div style="${getStyleBtnRemoveInnerText()}">&times;</div>`,
    '</div>',
  ].join(''),
  anchor: getAnchorBtnRemove(),
});
const getBtnRemoveIconBlur = () => ({
  content: [
    `<div style="${getStyleBtnRemoveBlur()}">`,
    `<div style="${getStyleBtnRemoveInnerText()}">&times;</div>`,
    '</div>',
  ].join(''),
  anchor: getAnchorBtnRemove(),
});
class PointMarker {
  #point

  #meta

  #overlayPointMarker

  #overlayPointMarkerEventController

  #overlayBtnRemove

  #overlayBtnRemoveEventController

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
    this.#overlayPointMarkerEventController = overlayEventHandler.createOverlayEventController({
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
    this.#overlayBtnRemove = null;
    this.#overlayBtnRemoveEventController = overlayEventHandler.createOverlayEventController({
      onFocus: () => {
        this.#overlayBtnRemove.setOptions({
          icon: getBtnRemoveIconFocus(),
        });
      },
      onBlur: () => {
        this.#overlayBtnRemove.setOptions({
          icon: getBtnRemoveIconBlur(),
        });
      },
      onClick: () => {},
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

    // 1. overlayPointMarker를 지도에 그립니다.
    this.#overlayPointMarker = naverMapWrapper.getMarker({
      position,
      icon: getPointMarkerIconStyleBlur(this.#mode),
      map,
    });
    this.#overlayPointMarkerEventController.setOverlay(this.#overlayPointMarker);

    // 2. overlayBtnRemove를 지도에 그립니다.
    this.#overlayBtnRemove = naverMapWrapper.getMarker({
      position,
      icon: getBtnRemoveIconBlur(),
      map,
    });
    this.#overlayBtnRemoveEventController.setOverlay(this.#overlayBtnRemove);
    // 2-2. overlayBtnRemove를 지도에서 숨깁니다.
    // pointMarker가 선택(SELECTED)되었을 때 지도에서 보여줍니다.
    this.#overlayBtnRemove.setVisible(false);
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
    if (this.#overlayBtnRemove) {
      this.#overlayBtnRemove.setMap(null);
      this.#overlayBtnRemove = null;
    }
  }

  /**
   * PointMarker를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#overlayPointMarkerEventController) {
      this.#overlayPointMarkerEventController.remove();
      this.#overlayPointMarkerEventController = null;
    }
    if (this.#overlayBtnRemoveEventController) {
      this.#overlayBtnRemoveEventController.remove();
      this.#overlayBtnRemoveEventController = null;
    }
  }

  /**
   * PointMarker를 focus시킵니다.
   *
   * @return {void} 반환값 없음
   */
  focus() {
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }
    if (this.#overlayPointMarkerEventController.isFocus()) {
      return;
    }

    if (this.#overlayPointMarker) {
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyleFocus(this.#mode),
      });
    }

    this.#overlayPointMarkerEventController.setStatus(OVERLAY_STATUS.FOCUS);
  }


  /**
   * PointMarker를 blur시킵니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }
    if (this.#overlayPointMarkerEventController.isBlur()) {
      return;
    }

    if (this.#overlayPointMarker) {
      this.#overlayPointMarker.setOptions({
        icon: getPointMarkerIconStyleBlur(this.#mode),
      });
    }

    this.#overlayPointMarkerEventController.setStatus(OVERLAY_STATUS.BLUR);
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

    if (!this.#overlayPointMarker) {
      return;
    }

    // 1. pointMarker의 표시상태를 아래 조합중 하나를 선택해 바꿉니다.
    // 1-1. FOCUS + ENABLED + SELECTED
    // 1-2. BLUR + ENABLED + SELECTED
    // 1-3. FOCUS + ENABLED + UNSELECTED
    // 1-4. BLUR + ENABLED + UNSELECTED
    const isFocus = this.#overlayPointMarkerEventController.isFocus();
    this.#overlayPointMarker.setOptions({
      icon: getPointMarkerIconStyle(isFocus, this.#mode),
    });
    // 2. btnRemove의 표시상태를 바꿉니다.
    // 2-1. pointMarker가 선택되면 지도에서 표시
    // 2-2. pointMarker가 선택이 해제되면 지도에서 숨김
    if (this.#mode === MODE_ENABLED_UNSELECTED) {
      this.#overlayBtnRemove.setVisible(false);
    } else if (this.#mode === MODE_ENABLED_SELECTED) {
      this.#overlayBtnRemove.setVisible(true);
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
      const isFocus = this.#overlayPointMarkerEventController.isFocus();
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
      const isFocus = this.#overlayPointMarkerEventController.isFocus();
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
    this.#overlayBtnRemove.setPosition(position);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPointMarkerEventController.addFocusListener(listener);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    this.#overlayPointMarkerEventController.removeFocusListener(id);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPointMarkerEventController.addBlurListener(listener);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    this.#overlayPointMarkerEventController.removeBlurListener(id);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    const id = this.#overlayPointMarkerEventController.addClickListener(listener);
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
    if (!this.#overlayPointMarkerEventController) {
      throw new Error('this.#overlayPointMarkerEventController/유효하지 않습니다.');
    }

    this.#overlayPointMarkerEventController.removeClickListener(id);
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
