import markerHandler from '../markerHandler';

// TODO marker group의 역할
// 1. 같은 맥락을 가지고 있는 마커들의 모음(예: 드라이버가 수행중인 픽업-드랍 마커 리스트)
class MarkerGroup {
  constructor(markers) {
    if (!markers || markers.length === 0) {
      throw new Error('distanceLines: 유효하지 않음');
    }
    this.markers = markers;
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    this.markers.forEach((v) => v.draw(map));
  }

  remove() {
    this.markers.forEach((v) => v.remove());
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
  createBaseMarker({
    lat,
    lng,
    name,
    color,
    bgColor,
    info,
  }) {
    return markerHandler.createBaseMarker({
      lat,
      lng,
      name,
      color,
      bgColor,
      info,
    });
  },
  /**
   * Marker 인스턴스의 배열을 인자로 받아 MarkerGroup의 인스턴스를 만듭니다.
   *
   * @param {array} markers - (required)Marker 인스턴스의 배열
   *
   * @return {MarkerGroup} MarkerGroup의 인스턴스
   */
  createMarkerGroup(markers) {
    return new MarkerGroup(markers);
  },
  /**
   * MarkerGroups 인스턴스의 배열을 인자로 받아 인스턴스가 가지고 있는 모든 Marker를 맵에 그립니다.
   *
   * @param {object} map - (required)Naver map의 인스턴스
   * @param {array} markerGroups - (required)MarkerGroups 인스턴스의 배열
   *
   * @return {void} 반환값 없음
   */
  drawMarkerGroups({
    map,
    markerGroups,
  }) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!markerGroups || markerGroups.length === 0) {
      return;
    }

    markerGroups.forEach((v) => v.draw(map));
  },
  /**
   * MarkerGroups 인스턴스의 배열을 인자로 받아 인스턴스가 가지고 있는 모든 Marker를 맵에서 지웁니다.
   *
   * @param {array} markerGroups - (required)MarkerGroups 인스턴스의 배열
   *
   * @return {void} 반환값 없음
   */
  removeMarkerGroups(markerGroups) {
    markerGroups.forEach((v) => v.remove());
  },
};
