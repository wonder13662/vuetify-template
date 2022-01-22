export default {
  isLatitude(v) {
    return Number.isFinite(v) && v >= -90 && v <= 90;
  },
  isLongitude(v) {
    return Number.isFinite(v) && v >= -180 && v <= 180;
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
};
