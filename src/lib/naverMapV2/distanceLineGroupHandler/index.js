import distanceLineHandler from './distanceLineHandler';

class DistanceLineGroup {
  constructor(distanceLineSrcArr) {
    if (!distanceLineSrcArr || distanceLineSrcArr.length === 0) {
      throw new Error('distanceLineSrcArr: 유효하지 않음');
    }
    this.distanceLines = distanceLineSrcArr.map((v) => {
      const {
        start,
        end,
      } = v;
      return distanceLineHandler.createDistanceLine({ start, end });
    });
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    this.distanceLines.forEach((v) => v.draw(map));
  }

  remove() {
    this.distanceLines.forEach((v) => v.remove());
  }
}

export default {
  /**
   * Naver 지도위에 거리를 표시하는 DistanceLineGroup의 인스턴스의 배열을 만듭니다.
   *
   * @param {array} distanceLineSrcArr - (required)DistanceLineGroup의 인스턴스를 만들기 위한 데이터의 배열
   *
   * @return {DistanceLineGroup} DistanceLineGroup의 인스턴스
   */
  createDistanceLineGroup(distanceLineSrcArr) {
    if (!distanceLineSrcArr || distanceLineSrcArr.length === 0) {
      throw new Error('distanceLineSrcArr: 유효하지 않음');
    }
    return new DistanceLineGroup(distanceLineSrcArr);
  },
  /**
   * Naver 지도위에 거리를 표시하는 DistanceLineGroup의 distanceLine을 그립니다.
   *
   * @param {object} map - (required)Naver map의 인스턴스
   * @param {DistanceLineGroup} distanceLineGroup - (required)DistanceLineGroup의 인스턴스
   *
   * @return {void} 반환값 없음
   */
  drawDistanceLineGroup({ map, distanceLineGroups }) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!distanceLineGroups || distanceLineGroups.length === 0) {
      return;
    }
    distanceLineGroups.forEach((v) => v.draw(map));
  },
  /**
   * Naver 지도위에 거리를 표시하는 DistanceLineGroup의 distanceLine을 지웁니다.
   *
   * @param {array} distanceLineGroup - (required)DistanceLineGroup의 인스턴스의 배열
   *
   * @return {void} 반환값 없음
   */
  removeDistanceLineGroup(distanceLineGroups) {
    if (!distanceLineGroups || distanceLineGroups.length === 0) {
      return;
    }
    distanceLineGroups.forEach((v) => v.remove());
  },
};
