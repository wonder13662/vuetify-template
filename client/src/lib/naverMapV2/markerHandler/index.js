import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../overlayEventHandler';
import utils from '../lib/utils';

const getStyle = (color, bgColor) => {
  const styleContainer = 'opacity:.8;';
  const styleMarkerHead = [
    `background:${color};`,
    'position: absolute;',
    'z-index: 1;',
    'width: 18px;',
    'height: 18px;',
    'border-radius: 9px;',
    'top: 3px;',
    'left: 3px;',
    'box-sizing: border-box;',
  ].join('');

  const styleMarkerBgHead = [
    `background:${bgColor};`,
    'width: 24px;',
    'height: 24px;',
    'border-radius: 12px;',
    'box-sizing: border-box;',
    'z-index: -1;',
  ].join('');
  const styleMarkerBgTail = [
    `background:${bgColor};`,
    'position: absolute;',
    'width: 18px;',
    'height: 18px;',
    'left: 50%;',
    'transform: translate(-50%, -13px) rotate(45deg) skew(16deg, 16deg);',
    'z-index: -2;',
  ].join('');
  const styleMarkerLabelContainer = [
    'min-width: 150px;',
  ].join('');
  const styleMarkerLabel = [
    `background:${color};`,
    `border: 1px solid ${bgColor};`,
    'display: inline-block;',
    'font-size: 0.7rem;',
    'padding: 3px 11px;',
    'border-radius: 16px;',
  ].join('');
  const styleCustomInfoWindow = [
    'background: white;',
    'border:solid 1px rgba(0,0,0,.3);',
    'width: 150px;',
    'padding: 5px;',
    'font-size: .6rem;',
  ].join('');

  return {
    styleContainer,
    styleMarkerHead,
    styleMarkerBgHead,
    styleMarkerBgTail,
    styleMarkerLabelContainer,
    styleMarkerLabel,
    styleCustomInfoWindow,
  };
};

const getIcon = (style, size, anchor) => {
  const {
    styleContainer,
    styleMarkerHead,
    styleMarkerBgHead,
    styleMarkerBgTail,
  } = style;

  return {
    content: [
      `<div id="marker-container" style="${styleContainer}">`,
      ` <div id="marker-head" style="${styleMarkerHead}"></div>`,
      ` <div id="marker-bg-head" style="${styleMarkerBgHead}"></div>`,
      ` <div id="marker-bg-tail" style="${styleMarkerBgTail}"></div>`,
      '</div>',
    ].join(''),
    size,
    anchor,
  };
};

const getIconHover = (style, size, anchor) => {
  const {
    styleMarkerHead,
    styleMarkerBgHead,
    styleMarkerBgTail,
  } = style;

  return {
    content: [
      '<div id="marker-container">',
      ` <div id="marker-head" style="${styleMarkerHead}"></div>`,
      ` <div id="marker-bg-head" style="${styleMarkerBgHead}"></div>`,
      ` <div id="marker-bg-tail" style="${styleMarkerBgTail}"></div>`,
      '</div>',
    ].join(''),
    size,
    anchor,
  };
};

const getMarker = ({
  map,
  lat,
  lng,
  icon,
}) => (naverMapWrapper.getMarker({
  position: naverMapWrapper.getLatLng(lat, lng),
  map,
  icon,
}));

const getLabel = ({
  style,
  map,
  lat,
  lng,
  name,
}) => {
  const {
    styleMarkerLabelContainer,
    styleMarkerLabel,
  } = style;
  return naverMapWrapper.getMarker({
    position: naverMapWrapper.getLatLng(lat, lng),
    map,
    icon: {
      content: [
        `<div id="marker-label-container" style="${styleMarkerLabelContainer}">`,
        ` <div id="marker-label" style="${styleMarkerLabel}">`,
        `  ${name}`,
        ' </div>',
        '</div>',
      ].join(''),
      anchor: naverMapWrapper.getPoint(-18, 38),
    },
  });
};

const getCustomInfoWindow = ({
  style,
  map,
  lat,
  lng,
  info,
}) => {
  const {
    styleCustomInfoWindow,
  } = style;
  return naverMapWrapper.getMarker({
    position: naverMapWrapper.getLatLng(lat, lng),
    map,
    icon: {
      content: [
        `<div style="${styleCustomInfoWindow}">`,
        `${info}`,
        '</div>',
      ].join(''),
      anchor: naverMapWrapper.getPoint(0, 0),
    },
  });
};

const getSize = () => (naverMapWrapper.getSize(24, 36));
const getAnchor = () => (naverMapWrapper.getPoint(12, 36));

class BaseMarker {
  #lat

  #lng

  #name

  #color

  #bgColor

  #info

  #overlayMarkerEventController

  #overlayLabelEventController

  #customInfoWindow

  #style

  #marker

  #label

  #meta

  /**
   * 기본 마커를 만듭니다.
   *
   * @param {number} lat - (required)latitude 위도 ex) 남위 35도
   * @param {number} lng - (required)longitude 경도 ex) 동경 20도 15분
   * @param {string} name - (required)마커의 이름
   * @param {string} color - (optional)마커의 색상
   * @param {string} bgColor - (optional)마커의 배경 색상
   * @param {string} info - (optional)추가 정보 텍스트. 마우스 호버시 노출됩니다.
   * @param {object} meta - (optional)마커의 메타정보
   *
   * @return {BaseMarker} BaseMarker의 인스턴스
   */
  constructor({
    lat,
    lng,
    name,
    color = 'red',
    bgColor = 'white',
    info = '추가 정보 텍스트. 마우스 호버시 노출됩니다',
    meta = {},
  }) {
    this.#lat = lat;
    this.#lng = lng;
    this.#name = name;
    this.#color = color;
    this.#bgColor = bgColor;
    this.#info = info;

    this.#style = getStyle(color, bgColor);

    this.#marker = null;
    this.#label = null;
    this.#customInfoWindow = null;
    this.#meta = meta;

    this.#overlayMarkerEventController = overlayEventHandler.createOverlayEventController({
      onFocus: () => {
        this.focus();
      },
      onBlur: () => {
        this.blur();
      },
      onClick: () => ({}),
      meta: { ...this.#meta },
    });

    this.#overlayLabelEventController = overlayEventHandler.createOverlayEventController({
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
   * 기본 마커를 네이버 지도 객체 위에 그립니다.
   *
   * @param {object} map - (required) 네이버 맵 인스턴스
   *
   * @return {void} 반환값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    // NOTE: 지도 위에 표시되는 인스턴스는 1개여야 하므로 이전에 인스턴스 내에서 그린 마커가 있다면 지웁니다.
    this.remove();

    // 인스턴스 생성 및 EventListener 추가
    this.#marker = getMarker({
      map,
      lat: this.#lat,
      lng: this.#lng,
      icon: getIcon(this.#style, getSize(), getAnchor()),
    });
    this.#overlayMarkerEventController.setOverlay(this.#marker);

    this.#label = getLabel({
      style: this.#style,
      map,
      lat: this.#lat,
      lng: this.#lng,
      name: this.#name,
    });
    this.#overlayLabelEventController.setOverlay(this.#label);

    this.#customInfoWindow = getCustomInfoWindow({
      style: this.#style,
      map,
      lat: this.#lat,
      lng: this.#lng,
      info: this.#info,
    });
    this.#customInfoWindow.setVisible(false);
  }

  /**
   * 기본 마커를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#marker) {
      this.#marker.setMap(null);
      this.#marker = null;
    }
    if (this.#label) {
      this.#label.setMap(null);
      this.#label = null;
    }
    if (this.#customInfoWindow) {
      this.#customInfoWindow.setMap(null);
      this.#customInfoWindow = null;
    }
  }

  /**
   * Marker를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#overlayMarkerEventController) {
      this.#overlayMarkerEventController.remove();
      this.#overlayMarkerEventController = null;
    }
    if (this.#overlayLabelEventController) {
      this.#overlayLabelEventController.remove();
      this.#overlayLabelEventController = null;
    }
  }

  /**
   * 기본 마커를 Focus 상태로 표시합니다.
   *
   * @return {void} 반환값 없음
   */
  focus() {
    if (!this.#overlayMarkerEventController) {
      throw new Error('this.#overlayMarkerEventController/유효하지 않습니다.');
    }
    if (this.#overlayMarkerEventController.isFocus()) {
      return;
    }
    if (!this.#marker) {
      throw new Error('this.#marker: 유효하지 않음');
    }
    if (!this.#customInfoWindow) {
      throw new Error('this.#customInfoWindow: 유효하지 않음');
    }
    this.#marker.setIcon(getIconHover(this.#style, getSize(), getAnchor()));
    this.#customInfoWindow.setVisible(true);
    this.#overlayMarkerEventController.setStatusFocus();
  }

  /**
   * 기본 마커를 Blur 상태로 표시합니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    if (!this.#overlayMarkerEventController) {
      throw new Error('this.#overlayMarkerEventController/유효하지 않습니다.');
    }
    if (this.#overlayMarkerEventController.isBlur()) {
      return;
    }
    if (!this.#marker) {
      throw new Error('this.#marker: 유효하지 않음');
    }
    if (!this.#customInfoWindow) {
      throw new Error('this.#customInfoWindow: 유효하지 않음');
    }
    this.#marker.setIcon(getIcon(this.#style, getSize(), getAnchor()));
    this.#customInfoWindow.setVisible(false);
    this.#overlayMarkerEventController.setStatusBlur();
  }

  /**
   * 마커의 위치를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   *
   * @return {void} 반환값 없음
   */
  setPosition(lat, lng) {
    if (!utils.isLatitude(lat)) {
      throw new Error(`lat:${lat} - 유효하지 않음`);
    }
    if (!utils.isLongitude(lng)) {
      throw new Error(`lng:${lng} - 유효하지 않음`);
    }
    this.#lat = lat;
    this.#lng = lng;

    if (this.#marker) {
      this.#marker.setPosition({ lat, lng });
    }
    if (this.#label) {
      this.#label.setPosition({ lat, lng });
    }
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
    if (this.#marker) {
      this.#marker.setVisible(visible);
    }
    if (this.#label) {
      this.#label.setVisible(visible);
    }
  }

  /**
   * BaseMarker에 click 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {void} 반환값 없음
   */
  addClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (this.#overlayMarkerEventController) {
      this.#overlayMarkerEventController.addClickListener(listener);
    }
    if (this.#overlayLabelEventController) {
      this.#overlayLabelEventController.addClickListener(listener);
    }
  }

  /**
   * BaseMarker에 focus 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - focus 이벤트 리스너
   *
   * @return {void} 반환값 없음
   */
  addFocusListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (this.#overlayMarkerEventController) {
      this.#overlayMarkerEventController.addFocusListener(listener);
    }
    if (this.#overlayLabelEventController) {
      this.#overlayLabelEventController.addFocusListener(listener);
    }
  }

  /**
   * BaseMarker에 blur 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - blur 이벤트 리스너
   *
   * @return {void} 반환값 없음
   */
  addBlurListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (this.#overlayMarkerEventController) {
      this.#overlayMarkerEventController.addBlurListener(listener);
    }
    if (this.#overlayLabelEventController) {
      this.#overlayLabelEventController.addBlurListener(listener);
    }
  }
}

export default {
  /**
   * 기본 마커를 만듭니다.
   *
   * @param {number} lat - (required)latitude 위도 ex) 남위 35도
   * @param {number} lng - (required)longitude 경도 ex) 동경 20도 15분
   * @param {string} name - (required)마커의 이름
   * @param {string} color - (optional)마커의 색상
   * @param {string} bgColor - (optional)마커의 배경 색상
   * @param {string} info - (optional)추가 정보 텍스트. 마우스 호버시 노출됩니다.
   *
   * @return {BaseMarker} BaseMarker의 인스턴스
   */
  createBaseMarker: ({
    lat,
    lng,
    name,
    color,
    bgColor,
    info,
  }) => (new BaseMarker({
    lat,
    lng,
    name,
    color,
    bgColor,
    info,
  })),
};
