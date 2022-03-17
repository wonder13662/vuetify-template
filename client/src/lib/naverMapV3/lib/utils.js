import {
  uncompact, // https://h3geo.org/docs/api/hierarchy#uncompact
  h3IsValid, // https://h3geo.org/docs/api/inspection#h3isvalid
  pointDist, // https://h3geo.org/docs/api/misc#pointdistm
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
  UNITS,
} from 'h3-js';
import utils from '@/lib/utils';

// https://h3geo.org/docs/core-library/restable
const H3_RESOLUTION_MIN = 0;
const H3_RESOLUTION_DEFAULT = 9;
const H3_RESOLUTION_MAX = 15;

export default {
  isLatitude(v) { // 위도, 남위, 북위
    return Number.isFinite(v) && v >= -90 && v <= 90;
  },
  isLongitude(v) { // 경도, 동경, 서경
    return Number.isFinite(v) && v >= -180 && v <= 180;
  },
  /**
   * Point가 유효한지 확인합니다.
   *
   * @param {Point} p1 - lat(위도), lng(경도)를 가지는 위치 정보
   *
   * @return {boolean} Point가 유효한지  여부
   */
  isValidPoint(p1) {
    if (!p1 || !this.isLatitude(p1.lat) || !this.isLongitude(p1.lng)) {
      return false;
    }
    return true;
  },
  /**
   * 2개의 Point들을 받아서 같은 위치인지 확인합니다.
   *
   * @param {Point} p1 - lat(위도), lng(경도)를 가지는 위치 정보
   * @param {Point} p2 - lat(위도), lng(경도)를 가지는 위치 정보
   *
   * @return {boolean} 2개의 Point들이 같은 위치인지 여부
   */
  isSamePoints(p1, p2) {
    if (!this.isValidPoint(p1)) {
      return false;
    }
    if (!this.isValidPoint(p2)) {
      return false;
    }
    if (p1.lat !== p2.lat) {
      return false;
    }
    if (p1.lng !== p2.lng) {
      return false;
    }
    return true;
  },
  /**
   * 2개의 좌표를 받아서, 두 좌표의 위도, 경도 값중 남서쪽(Bounds 사각형의 좌측하단) 좌표를 구해줍니다.
   *
   * @param {object} p1 - lat(위도), lng(경도)를 가지는 위치 정보
   * @param {object} p2 - lat(위도), lng(경도)를 가지는 위치 정보
   *
   * @return {object} 남서쪽(Bounds 사각형의 좌측하단)의 lat(위도), lng(경도) 좌표
   */
  getSWby2Points(p1, p2) {
    if (!p1 && !p2) {
      throw new Error('p1, p2 / 유효하지 않습니다.');
    }

    if (p1 && !p2) {
      return {
        lat: p1.lat,
        lng: p1.lng,
      };
    }

    if (!p1 && p2) {
      return {
        lat: p2.lat,
        lng: p2.lng,
      };
    }

    const lat = p1.lat < p2.lat ? p1.lat : p2.lat;
    const lng = p1.lng < p2.lng ? p1.lng : p2.lng;

    return { lat, lng };
  },
  /**
   * 2개의 좌표를 받아서, 두 좌표의 위도, 경도 값중 북동쪽(Bounds 사각형의 우측상단) 좌표를 구해줍니다.
   *
   * @param {object} p1 - lat(위도), lng(경도)를 가지는 위치 정보
   * @param {object} p2 - lat(위도), lng(경도)를 가지는 위치 정보
   *
   * @return {object} 북동쪽(Bounds 사각형의 우측상단)의 lat(위도), lng(경도) 좌표
   */
  getNEby2Points(p1, p2) {
    if (!p1 && !p2) {
      throw new Error('p1, p2 / 유효하지 않습니다.');
    }

    if (p1 && !p2) {
      return {
        lat: p1.lat,
        lng: p1.lng,
      };
    }

    if (!p1 && p2) {
      return {
        lat: p2.lat,
        lng: p2.lng,
      };
    }

    const lat = p1.lat < p2.lat ? p2.lat : p1.lat;
    const lng = p1.lng < p2.lng ? p2.lng : p1.lng;

    return { lat, lng };
  },
  /**
   * h3Index가 유효한지 확인합니다.
   *
   * @param {string} h3Index - h3Index의 id값
   *
   * @return {boolean} h3Index가 유효한지 여부의 boolean 값
   */
  h3IsValid(h3Index) {
    return h3IsValid(h3Index);
  },
  /**
   * 인자로 받은 2개의 Point 객체가 같은 h3Index에 있는지 확인합니다.
   *
   * @param {Point} a - lat, lng 속성을 가지는 Point 객체
   * @param {Point} b - lat, lng 속성을 가지는 Point 객체
   * @param {number} h3Resolution - h3의 resolution
   *
   * @return {boolean} 인자로 받은 2개의 Point 객체가 같은 h3Index에 있는지 여부
   */
  isSameH3IndexByPoints(a, b, h3Resolution) { // TODO 테스트 코드 필요
    if (!a || !b) {
      return false;
    }
    if (!this.isValidPoint(a)) {
      throw new Error(`isSameH3IndexByPoints/a:${a}/유효하지 않습니다.`);
    }
    if (!this.isValidPoint(b)) {
      throw new Error(`isSameH3IndexByPoints/b:${b}/유효하지 않습니다.`);
    }
    if (!this.isValidH3Resolution(h3Resolution)) {
      throw new Error(`isSameH3IndexByPoints/h3Resolution:${h3Resolution}/유효하지 않습니다.`);
    }
    const h3IndexA = geoToH3(a.lat, a.lng, h3Resolution);
    const h3IndexB = geoToH3(b.lat, b.lng, h3Resolution);

    return h3IndexA === h3IndexB;
  },
  /**
   * h3의 resolution이 입력가능한 범위인지 여부를 확인한다
   *
   * @param {number} h3Resolution - h3의 resolution
   *
   * @return {boolean} h3의 resolution이 입력가능한 범위인지 여부
   */
  isValidH3Resolution(h3Resolution) { // TODO 테스트 코드 필요
    if (!utils.isUnsignedInteger(h3Resolution)) {
      return false;
    }
    if (h3Resolution < H3_RESOLUTION_MIN || h3Resolution > H3_RESOLUTION_MAX) {
      return false;
    }
    return true;
  },
  /**
   * 2 개의 point 간의 거리(m)를 구합니다.
   *
   * @param {object} p1 - lat(위도), lng(경도)를 가지는 위치 정보
   * @param {object} p2 - lat(위도), lng(경도)를 가지는 위치 정보
   *
   * @return {number} 2 개의 point 간의 거리(m) number 값
   */
  pointDist(p1, p2) {
    if (!this.isValidPoint(p1)) {
      return -1;
    }
    if (!this.isValidPoint(p2)) {
      return -1;
    }
    return pointDist([p1.lat, p1.lng], [p2.lat, p2.lng], UNITS.m);
  },
  /**
   * 압축(compact)된 h3Index를 지정된 resolution의 h3Index로 압축을 풉니다(uncompact).
   *
   * @param {array<string>} compactH3Indexes
   * @param {number} resolution - h3 resolution
   *
   * @return {array<string>} uncompactH3Indexes
   */
  uncompact(compactH3Indexes, resolution = H3_RESOLUTION_DEFAULT) {
    return uncompact(compactH3Indexes, resolution);
  },
};
