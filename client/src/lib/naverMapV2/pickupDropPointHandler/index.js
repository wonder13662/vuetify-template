import markerHandler from '../markerGroupHandler/markerHandler';
import distanceLineHandler from '../distanceLineGroupHandler/distanceLineHandler';
import utils from '../lib/utils';

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

const createDriverPointMarker = (point) => (markerHandler.createBaseMarker({
  lat: point.lat,
  lng: point.lng,
  name: '드라이버',
  color: 'green', // TODO 수정 필요
  bgColor: 'black', // TODO 수정 필요
  info: '정보없음',
}));

class PickupDropPoints {
  #pickupPoint

  #dropPoint

  #driverPoint

  #pickupPointMarker

  #dropPointMarker

  #distanceLine

  #driverPointMarker

  constructor(pickupPoint, dropPoint, driverPoint) {
    this.#pickupPoint = { ...pickupPoint };
    this.#dropPoint = { ...dropPoint };
    if (driverPoint) {
      this.#driverPoint = { ...driverPoint };
    }
    this.#pickupPointMarker = createPickupPointMarker(this.#pickupPoint);
    this.#dropPointMarker = createDropPointMarker(this.#dropPoint);
    this.#distanceLine = createDistanceLine(this.#pickupPoint, this.#dropPoint);
    if (this.#driverPoint) {
      this.#driverPointMarker = createDriverPointMarker(this.#driverPoint);
    }
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    this.#pickupPointMarker.draw(map);
    this.#dropPointMarker.draw(map);
    this.#distanceLine.draw(map);
    if (this.#driverPointMarker) {
      this.#driverPointMarker.draw(map);
    }
  }

  remove() {
    this.#pickupPointMarker.remove();
    this.#dropPointMarker.remove();
    this.#distanceLine.remove();
    if (this.#driverPointMarker) {
      this.#driverPointMarker.remove();
    }
  }
}

export default {
  create({ pickupPoint, dropPoint, driverPoint }) {
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
    if (driverPoint) {
      if (!utils.isLatitude(driverPoint.lat)) {
        throw new Error(`driverPoint.lat:${dropPoint.lat} / 유효하지 않습니다.`);
      }
      if (!utils.isLongitude(driverPoint.lng)) {
        throw new Error(`driverPoint.lng:${dropPoint.lng} / 유효하지 않습니다.`);
      }
    }

    return new PickupDropPoints(pickupPoint, dropPoint, driverPoint);
  },
};
