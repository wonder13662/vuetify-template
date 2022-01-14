// import markerGroupHandler from '../markerGroupHandler';
import markerHandler from '../markerGroupHandler/markerHandler';
import distanceLineHandler from '../distanceLineGroupHandler/distanceLineHandler';
import utils from '../lib/utils';

// 필요한 기능 목록
// 1-1. (필수)픽업지 좌표의 픽업 마커를 지도 위에 그린다
// 1-2. (선택)픽업 마커에 mouseover, mouseleave 이벤트 리스너를 등록할 수 있다.
// 1-98. (선택)픽업 마커에 mouseover, mouseleave 이벤트 리스너를 해제할 수 있다.
// 1-99. (필수)픽업지 좌표의 픽업 마커를 지도 위에 지운다
// 2-1. (필수)드랍지 좌표의 드랍 마커를 지도 위에 그린다
// 2-2. (선택)드랍 마커에 mouseover, mouseleave 이벤트 리스너를 등록할 수 있다.
// 2-98. (선택)드랍 마커에 mouseover, mouseleave 이벤트 리스너를 해제할 수 있다.
// 2-99. (필수)드랍지 좌표의 드랍 마커를 지도 위에 지운다
// 3-1. 픽업마커와 드랍마커 사이의 거리마커를 지도 위에 그린다
// 3-99. 픽업마커와 드랍마커 사이의 거리마커를 지도 위에 지운다

const createPickupPointMarker = (point) => (markerHandler.createBaseMarker({
  lat: point.lat,
  lng: point.lng,
  name: '픽업',
  color: 'red', // TODO 수정 필요
  bgColor: 'black', // TODO 수정 필요
  info: '정보없음',
}));

const createDropPointMarker = (point) => (markerHandler.createBaseMarker({
  lat: point.lat,
  lng: point.lng,
  name: '드랍',
  color: 'yellow', // TODO 수정 필요
  bgColor: 'black', // TODO 수정 필요
  info: '정보없음',
}));

const createDistanceLine = (pickupPoint, dropPoint) => distanceLineHandler.createDistanceLine({
  start: pickupPoint,
  end: dropPoint,
});

class PickupDropPoints {
  #pickupPoint

  #dropPoint

  #pickupPointMarker

  #dropPointMarker

  #distanceLine

  constructor(pickupPoint, dropPoint) {
    this.#pickupPoint = { ...pickupPoint };
    this.#dropPoint = { ...dropPoint };
    this.#pickupPointMarker = createPickupPointMarker(this.#pickupPoint);
    this.#dropPointMarker = createDropPointMarker(this.#dropPoint);
    this.#distanceLine = createDistanceLine(this.#pickupPoint, this.#dropPoint);
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    this.#pickupPointMarker.draw(map);
    this.#dropPointMarker.draw(map);
    this.#distanceLine.draw(map);
  }

  remove() {
    this.#pickupPointMarker.remove();
    this.#dropPointMarker.remove();
    this.#distanceLine.remove();
  }
}

export default {
  create({ pickupPoint, dropPoint }) {
    if (!utils.isLatitude(pickupPoint.lat)) {
      throw new Error(`pickupPoint.lat:${pickupPoint.lat} / 유효하지 않습니다.`);
    }
    if (!utils.isLongitude(pickupPoint.lng)) {
      throw new Error(`pickupPoint.lng:${pickupPoint.lng} / 유효하지 않습니다.`);
    }
    if (!utils.isLatitude(dropPoint.lat)) {
      throw new Error(`dropPoint.lat:${dropPoint.lat} / 유효하지 않습니다.`);
    }
    if (!utils.isLongitude(dropPoint.lng)) {
      throw new Error(`dropPoint.lng:${dropPoint.lng} / 유효하지 않습니다.`);
    }

    return new PickupDropPoints(pickupPoint, dropPoint);
  },
};
