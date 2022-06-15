import mapUtils from './utils';

class Bound {
  constructor(sw, ne) {
    if (!mapUtils.isValidPoint(sw)) {
      throw new Error(`sw:${sw}/유효하지 않습니다.`);
    }
    if (!mapUtils.isValidPoint(ne)) {
      throw new Error(`ne:${ne} 유효하지 않습니다.`);
    }
    if (sw.lat > ne.lat) { // TODO 음수인 지역도 있다. 음수인 경우는 더 작은 것이 맞다. 절대값으로 처리하면 될까? 확인 필요.
      throw new Error(`sw.lat:${sw.lat} > ne.lat:${ne.lat}: 유효하지 않습니다.`);
    }
    if (sw.lng > ne.lng) { // TODO 음수인 지역도 있다. 음수인 경우는 더 작은 것이 맞다. 절대값으로 처리하면 될까? 확인 필요.
      throw new Error(`sw.lng:${sw.lng} > ne.lng:${ne.lng}: 유효하지 않습니다.`);
    }

    this.sw = {
      lat: sw.lat,
      lng: sw.lng,
    };
    this.ne = {
      lat: ne.lat,
      lng: ne.lng,
    };
  }

  /**
   * 다른 bound의 영역과 자신의 영역을 합칩니다.
   *
   * @param {Bound} 합칠 대상이 되는 Bound 클래스의 인스턴스
   *
   * @return {Bound} Bound 클래스의 인스턴스
   */
  merge(bound) {
    if (!bound || !bound.sw || !bound.ne) {
      return this;
    }

    const { sw, ne } = bound;
    if (!mapUtils.isValidPoint(sw) || !mapUtils.isValidPoint(ne)) {
      return this;
    }
    const result = {
      sw: this.sw,
      ne: this.ne,
    };

    if (!result.sw.lat || result.sw.lat > sw.lat) {
      result.sw.lat = sw.lat;
    }
    if (!result.sw.lng || result.sw.lng > sw.lng) {
      result.sw.lng = sw.lng;
    }
    if (!result.ne.lat || result.ne.lat < ne.lat) {
      result.ne.lat = ne.lat;
    }
    if (!result.ne.lng || result.ne.lng < ne.lng) {
      result.ne.lng = ne.lng;
    }
    return new Bound(result.sw, result.ne);
  }

  /**
   * Bounds의 정보를 LatLngBoundsObjectLiteral로 바꿔줍니다.
   *
   * @return {LatLngBoundsObjectLiteral} Naver의 LatLngBoundsObjectLiteral 인스턴스
   */
  getLatLngBoundsObjectLiteral() {
    return {
      north: this.ne.lat,
      east: this.ne.lng,
      south: this.sw.lat,
      west: this.sw.lng,
    };
  }
  // TODO 현재 경계보다 확대, 축소된 경계를 제공하는 기능이 필요함
}

export default {
  /**
   * 2개 이상의 points 배열로 bounds를 만들어 줍니다.
   *
   * @param {array} points - lat, lng를 가지는 point의 배열
   *
   * @return {Bound} Bound 클래스의 인스턴스
   */
  createBoundsByPoints(points) {
    const { sw, ne } = points.reduce((acc, v) => {
      if (!v || !mapUtils.isLatitude(v.lat) || !mapUtils.isLongitude(v.lng)) {
        return acc;
      }
      return {
        sw: mapUtils.getSWby2Points(acc.sw, v),
        ne: mapUtils.getNEby2Points(acc.ne, v),
      };
    }, {
      sw: null,
      ne: null,
    });

    return this.createBounds(sw, ne);
  },
  /**
   * 2개의 points 배열로 bounds를 만들어 줍니다.
   *
   * @param {array} points - lat, lng를 가지는 point의 배열
   *
   * @return {Bound} Bound 클래스의 인스턴스
   */
  createBoundsBy2Points(p1, p2) {
    const sw = mapUtils.getSWby2Points(p1, p2);
    const ne = mapUtils.getNEby2Points(p1, p2);

    return this.createBounds(sw, ne);
  },
  createBounds(sw, ne) {
    return new Bound(sw, ne);
  },
};
