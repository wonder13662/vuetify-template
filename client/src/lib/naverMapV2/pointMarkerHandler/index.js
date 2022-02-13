import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../overlayEventHandler';
import {
  OVERLAY_STATUS,
} from '../lib/constants';
import utils from '../lib/utils';

const getStyleBlur = () => [
  'background: red;',
].join('');
const getPointMarkerAnchor = () => naverMapWrapper.getPoint(0, 0);
const getPointMarkerIconStyleBlur = () => ({
  content: `<div style="${getStyleBlur()}"><span>TEST</span></div>`,
  anchor: getPointMarkerAnchor(),
});

const getStyleFocus = () => [
  'background: green;',
].join('');
const getPointMarkerIconStyleFocus = () => ({
  content: `<div style="${getStyleFocus()}"><span>TEST</span></div>`,
  anchor: getPointMarkerAnchor(),
});

class PointMarker {
  #point

  #meta

  #overlayPointMarker

  #overlayPolylineEventController

  constructor({
    point,
    meta = {},
  }) {
    if (!utils.isLatitude(point.lat)) {
      throw new Error(`point.lat:${point.lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(point.lng)) {
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
      onClick: () => ({}),
      meta: { ...this.#meta },
    });
  }

  /**
   * 네이버 맵 위에 PointMarker를 그립니다. Overlay 타입의 필수 구현 메서드입니다.
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
      icon: getPointMarkerIconStyleBlur(),
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
        icon: getPointMarkerIconStyleFocus(),
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
        icon: getPointMarkerIconStyleBlur(),
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
