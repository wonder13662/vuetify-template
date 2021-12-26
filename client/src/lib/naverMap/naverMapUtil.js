import { Bound } from './Bound';
import { HexagonGroup } from '@/lib/naverMap/HexagonGroup';
import { HexagonSelector } from './HexagonSelector';

/**
 * Naver map 위에 h3Index 배열을 받아 외곽선을 그립니다.
 * infoHtml, infoFocusHtml에 정보를 주면, 우측에 추가 정보창을 그려줍니다.
 * infoHtml는 mouseout, infoFocusHtml는 mouseover 상황의 HTML을 나타냅니다.
 *
 * @param {array} h3Indexes - Hexagon을 그리기 위한 H3Index들의 배열
 * @param {string} infoHtml - 추가 정보창 HTML. mouseout시의 모습
 * @param {string} infoFocusHtml - 추가 정보창 HTML. mouseover시의 모습
 *
 * @return {HexagonGroup} HexagonGroup의 인스턴스
 */
const createHexagonGroup = ({
  h3Indexes = [],
  infoHtml = '',
  infoFocusHtml = '',
  meta = {},
  eventListener = () => ({}),
}) => (new HexagonGroup({
  h3Indexes,
  infoHtml,
  infoFocusHtml,
  meta,
  eventListener,
}));

export default {
  /**
   * Hexagon group의 좌표로 Bound 클래스의 인스턴스를 만들어 돌려줍니다.
   *
   * @return {Bound} Bound 클래스의 인스턴스
   */
  createBound: (sw, ne) => (new Bound(sw, ne)),

  /**
   * 디렉터 웹의 통합관제 지도의 Physical group(지역 그룹) hexagon을 그립니다.
   * PhysicalGroup의 상세 정보 마커도 함께 그립니다.
   *
   * @param {array} h3Indexes - Physical group을 나타내는 h3Index
   * @param {string} physicalGroupName - Physical group의 이름
   * @param {string} driverCnt - Physical group에서 배차 가능한 Driver의 인원수
   * @param {string} deliveryCnt - Physical group에서 배차 대기중인 delivery(배송)의 갯수
   *
   * @return {HexagonGroup} HexagonGroup의 인스턴스
   */
  createPhysicalGroup({ // FIXME 이름이 이상한데?
    h3Indexes = [],
    physicalGroupName = '',
    driverCnt = 0,
    deliveryCnt = 0,
    meta = {},
    eventListener = () => ({}),
  }) {
    const getInfoHtml = (style) => ([
      `<div style="${style}">`,
      ` <div>지역 그룹: ${physicalGroupName}</div>`,
      ` <div>배차 가능한 드라이버 수: ${driverCnt} 명</div>`,
      ` <div>배차 대기중인 배송 수: ${deliveryCnt} 건</div>`,
      '</div>',
    ].join(''));

    const styleMouseout = [
      'color: black;',
      'font-size: .6rem;',
    ].join('');

    const styleMouseover = [
      'color: red;',
      'font-size: .6rem;',
    ].join('');

    return createHexagonGroup({
      h3Indexes,
      infoHtml: getInfoHtml(styleMouseout),
      infoFocusHtml: getInfoHtml(styleMouseover),
      meta,
      eventListener,
    });
  },
  createHexagonSelector(naver, map, callback) {
    return new HexagonSelector(naver, map, callback);
  },
  /**
   * 레오의 기본 마커를 만듭니다.
   *
   * @param {object} naver - Naver 지도 클래스
   * @param {object} map - Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {number} lat - latitude 위도 ex) 남위 35도
   * @param {number} lng - longitude 경도 ex) 동경 20도 15분
   * @param {string} name - 마커의 이름
   * @param {string} color - 마커의 색상
   * @param {string} bgColor - 마커의 배경 색상
   * @param {string} info - 추가 정보 텍스트. 마우스 호버시 노출됩니다.
   *
   * @return {object} 네이버 맵 위의 default marker를 제어하는 메서드들을 가지는 객체 반환
   */
  createDefaultMarker: ({
    naver,
    map,
    lat,
    lng,
    name,
    color = 'red',
    bgColor = 'white',
    info = '추가 정보 텍스트. 마우스 호버시 노출됩니다',
  }) => {
    if (!naver) throw new Error('naver api 객체가 없습니다.');
    if (!map) throw new Error('naver map 객체가 없습니다.');

    const size = new naver.maps.Size(24, 36);
    const anchor = new naver.maps.Point(12, 36);

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

    const icon = {
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

    const iconHover = {
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

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map,
      icon,
    });

    // marker의 이름을 표시하는 label
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

    const label = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map,
      icon: {
        content: [
          `<div id="marker-label-container" style="${styleMarkerLabelContainer}">`,
          ` <div id="marker-label" style="${styleMarkerLabel}">`,
          `  ${name}`,
          ' </div>',
          '</div>',
        ].join(''),
        anchor: new naver.maps.Point(-18, 38),
      },
    });

    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-infowindow-simple.example.html
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-infowindow-options.example.html
    // Naver native info 윈도우 띄우기
    const infoWindow = new naver.maps.InfoWindow({
      content: [
        '<div>',
        '정보창입니다',
        '</div>',
      ].join(''),
    });

    // 커스텀 정보창(실은 추가 마커임)
    const styleCustomInfoWindow = [
      'background: white;',
      'border:solid 1px rgba(0,0,0,.3);',
      'width: 150px;',
      'padding: 5px;',
      'font-size: .6rem;',
    ].join('');
    const customInfoWindow = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map,
      icon: {
        content: [
          `<div style="${styleCustomInfoWindow}">`,
          `${info}`,
          '</div>',
        ].join(''),
        anchor: new naver.maps.Point(0, 0),
      },
    });
    customInfoWindow.setMap(null);

    const setAnimationBounce = () => marker.setAnimation(naver.maps.Animation.BOUNCE);
    const removeAnimationBounce = () => marker.setAnimation(null);
    const focus = () => {
      marker.setIcon(iconHover);
      customInfoWindow.setMap(map);
    };
    const blur = () => {
      marker.setIcon(icon);
      customInfoWindow.setMap(null);
    };
    const openInfoWindow = () => infoWindow.open(map, marker);
    const closeInfoWindow = () => infoWindow.close();

    const { addListener } = naver.maps.Event;
    const listeners = [];
    listeners.push(addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    }));
    listeners.push(addListener(marker, 'mouseover', () => focus()));
    listeners.push(addListener(marker, 'mouseout', () => blur()));

    const remove = () => {
      listeners.forEach((v) => naver.maps.Event.removeListener(v));
      removeAnimationBounce();
      marker.setMap(null);
      label.setMap(null);
      customInfoWindow.setMap(null);
    };

    return {
      remove,
      focus,
      blur,
      setAnimationBounce,
      removeAnimationBounce,
      openInfoWindow,
      closeInfoWindow,
    };
  },
  /**
   * 네이버 맵 위에 출발, 도착 지점을 잇는 선(Naver Polyline)을 그립니다.
   *
   * @param {object} naver - Naver 지도 네임스페이스
   * @param {object} map - Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} start - 출발 지점. lat, lng의 위치값을 가지는 객체
   * @param {object} end - 도착 지점. lat, lng의 위치값을 가지는 객체
   *
   * @return {object} 선(Naver Polyline)을 제어하는 기능을 가진 인스턴스 반환
   */
  createDistanceLine({
    naver,
    map,
    start,
    end,
  }) {
    if (!naver) throw new Error('naver api 객체가 없습니다.');
    if (!map) throw new Error('naver map 객체가 없습니다.');
    if (!start.lat || !start.lng) throw new Error('start 객체가 유효하지 않습니다.');
    if (!end.lat || !end.lng) throw new Error('end 객체가 유효하지 않습니다.');
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-shape-measures.example.html
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polyline.html
    // 실제 거리재기에 사용되는 폴리라인을 생성합니다.
    const coord = [
      new naver.maps.LatLng(start.lat, start.lng),
      new naver.maps.LatLng(end.lat, end.lng),
    ];
    // 화살표 스타일 적용
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-pointing-icon.example.html
    const polyline = new naver.maps.Polyline({
      strokeColor: '#f00',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      endIcon: naver.maps.PointingIcon.OPEN_ARROW,
      path: coord,
      map,
    });

    // 거리를 나타내는 위치는 출발과 도착의 중간 위치이어야 합니다.
    const latDiff = (end.lat - start.lat) / 2;
    const lngDiff = (end.lng - start.lng) / 2;
    const pointToMileStone = new naver.maps.LatLng(start.lat + latDiff, start.lng + lngDiff);

    // 폴리라인의 거리를 미터 단위로 반환합니다.
    const distanceInMeter = Math.round(polyline.getDistance());
    const style = [
      'display:inline-block;',
      'padding: 1px 5px;',
      'text-align:center;',
      'font-size:.6rem;',
      'color: white;',
      'font-weight: bold;',
      'background: red;',
      'border-radius: 10px;',
    ].join('');
    const mileStone = new naver.maps.Marker({
      position: pointToMileStone,
      icon: {
        content: `<div style="${style}"><span>${distanceInMeter}m</span></div>`,
        anchor: new naver.maps.Point(20, 15),
      },
      map,
    });

    const remove = () => {
      polyline.setMap(null);
      mileStone.setMap(null);
    };

    return {
      remove,
    };
  },
};
