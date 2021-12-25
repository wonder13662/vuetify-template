import naverMapWrapper from '../../lib/naverMapWrapper';

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

const getInfoWindow = () => (naverMapWrapper.getInfoWindow({
  content: [
    '<div>',
    '정보창입니다',
    '</div>',
  ].join(''),
}));

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
  constructor({
    lat,
    lng,
    name,
    color = 'red',
    bgColor = 'white',
    info = '추가 정보 텍스트. 마우스 호버시 노출됩니다',
  }) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.color = color;
    this.bgColor = bgColor;
    this.info = info;

    this.style = getStyle(color, bgColor);

    this.marker = null;
    this.label = null;
    this.infoWindow = null;
    this.customInfoWindow = null;

    this.listeners = [];
  }

  /**
   * 기본 마커를 네이버 지도 객체 위에 그립니다.
   *
   * @param {object} map - (required)latitude 위도 ex) 남위 35도
   *
   * @return {void} 반환값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    // 1. 인스턴스 생성
    this.marker = getMarker({
      map,
      lat: this.lat,
      lng: this.lng,
      icon: getIcon(this.style, getSize(), getAnchor()),
    });

    this.label = getLabel({
      style: this.style,
      map,
      lat: this.lat,
      lng: this.lng,
      name: this.name,
    });

    this.infoWindow = getInfoWindow();

    this.customInfoWindow = getCustomInfoWindow({
      style: this.style,
      map,
      lat: this.lat,
      lng: this.lng,
      info: this.info,
    });
    this.customInfoWindow.setMap(null);
    // 2. EventListener 추가
    this.listeners.push(naverMapWrapper.addListener(this.marker, 'click', () => {
      if (this.infoWindow.getMap()) {
        this.infoWindow.close();
      } else {
        this.infoWindow.open(map, this.marker);
      }
    }));
    this.listeners.push(naverMapWrapper.addListener(this.marker, 'mouseover', () => this.focus(map)));
    this.listeners.push(naverMapWrapper.addListener(this.marker, 'mouseout', () => this.blur(map)));
  }

  /**
   * 기본 마커를 네이버 지도 객체 위에서 제거합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    naverMapWrapper.removeListener(this.listeners);
    this.marker.setMap(null);
    this.label.setMap(null);
    this.customInfoWindow.setMap(null);
  }

  /**
   * 기본 마커를 Focus 상태로 표시합니다.
   *
   * @param {object} map - Naver map 인스턴스
   *
   * @return {void} 반환값 없음
   */
  focus(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!this.marker) {
      throw new Error('this.marker: 유효하지 않음');
    }
    if (!this.customInfoWindow) {
      throw new Error('this.customInfoWindow: 유효하지 않음');
    }
    this.marker.setIcon(getIconHover(this.style, getSize(), getAnchor()));
    this.customInfoWindow.setMap(map);
  }

  /**
   * 기본 마커를 Blur 상태로 표시합니다.
   *
   * @param {object} map - Naver map 인스턴스
   *
   * @return {void} 반환값 없음
   */
  blur(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    this.marker.setIcon(getIcon(this.style, getSize(), getAnchor()));
    this.customInfoWindow.setMap(null);
  }

  /**
   * 기본 마커의 infoWindow를 맵에 표시합니다.
   *
   * @param {object} map - Naver map 인스턴스
   *
   * @return {void} 반환값 없음
   */
  openInfoWindow(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!this.marker) {
      throw new Error('this.marker: 유효하지 않음');
    }
    if (!this.infoWindow) {
      throw new Error('this.infoWindow: 유효하지 않음');
    }
    this.infoWindow.open(map, this.marker);
  }

  /**
   * 기본 마커의 infoWindow를 맵에서 지웁니다.
   *
   * @param {object} map - Naver map 인스턴스
   *
   * @return {void} 반환값 없음
   */
  closeInfoWindow() {
    if (!this.infoWindow) {
      throw new Error('this.infoWindow: 유효하지 않음');
    }
    this.infoWindow.close();
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
