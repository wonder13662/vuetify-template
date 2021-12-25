import {
  add,
  subtract,
  divide,
} from 'mathjs';
import utils from '../../lib/utils';
import naverMapWrapper from '../../lib/naverMapWrapper';

class DistanceLine {
  constructor({
    start,
    end,
  }) {
    this.start = start;
    this.end = end;

    this.polyline = null;
    this.style = [
      'display:inline-block;',
      'padding: 1px 5px;',
      'text-align:center;',
      'font-size:.6rem;',
      'color: white;',
      'font-weight: bold;',
      'background: red;',
      'border-radius: 10px;',
    ].join('');
    this.distanceMarker = null;
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    this.polyline = naverMapWrapper.getPolyline({
      strokeColor: '#f00',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      endIcon: naverMapWrapper.pointingIconOpenArrow(),
      path: [
        naverMapWrapper.getLatLng(this.start.lat, this.start.lng),
        naverMapWrapper.getLatLng(this.end.lat, this.end.lng),
      ],
      map,
    });

    // 거리를 나타내는 위치는 출발과 도착의 중간 위치이어야 합니다.
    const latDiff = divide(subtract(this.end.lat, this.start.lat), 2);
    const lngDiff = divide(subtract(this.end.lng, this.start.lng), 2);
    const lat = add(this.start.lat, latDiff);
    const lng = add(this.start.lng, lngDiff);
    const distanceMarkerPoint = naverMapWrapper.getLatLng(lat, lng);

    // 폴리라인의 거리를 미터 단위로 반환합니다.
    const distanceInMeter = Math.round(this.polyline.getDistance());

    this.distanceMarker = naverMapWrapper.getMarker({
      position: distanceMarkerPoint,
      icon: {
        content: `<div style="${this.style}"><span>${distanceInMeter}m</span></div>`,
        anchor: naverMapWrapper.getPoint(20, 15),
      },
      map,
    });
  }

  remove() {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    if (this.distanceMarker) {
      this.distanceMarker.setMap(null);
    }
  }
}

export default {
  /**
   * 네이버 맵 위에 출발, 도착 지점을 잇는 선(Naver Polyline)을 표시하는 DistanceLine 인스턴스를 만듭니다.
   *
   * @param {object} map - (required)Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} start - (required)출발 지점. lat, lng의 위치값을 가지는 객체
   * @param {object} end - (required)도착 지점. lat, lng의 위치값을 가지는 객체
   *
   * @return {DistanceLine} DistanceLine 인스턴스 반환
   */
  createDistanceLine({
    start,
    end,
  }) {
    if (!start || !utils.isLatitude(start.lat) || !utils.isLongitude(start.lng)) {
      throw new Error('start: 유효하지 않음');
    }
    if (!end || !utils.isLatitude(end.lat) || !utils.isLongitude(end.lng)) {
      throw new Error('end: 유효하지 않음');
    }

    return new DistanceLine({
      start,
      end,
    });
  },
  /**
   * 네이버 맵 위에 DistanceLine 인스턴스를 그립니다.
   *
   * @param {object} map - (required)Naver 지도 클래스로 만든 Naver 지도 instance
   * @param {object} distacneLine - (required)DistanceLine 인스턴스
   *
   * @return {void} 반환값 없음
   */
  drawDistanceLine(map, distacneLine) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (!distacneLine) {
      throw new Error('distacneLine: 유효하지 않음');
    }

    distacneLine.draw(map);
  },
  removeDistanceLine(distacneLine) {
    if (!distacneLine) {
      throw new Error('distacneLine: 유효하지 않음');
    }

    distacneLine.remove();
  },
};
