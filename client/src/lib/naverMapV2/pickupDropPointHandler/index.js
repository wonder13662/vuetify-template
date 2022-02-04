import markerHandler from '../markerGroupHandler/markerHandler';
import distanceLineHandler from '../distanceLineGroupHandler/distanceLineHandler';
import boundHandler from '../lib/boundHandler';
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

  #meta

  constructor(pickupPoint, dropPoint, driverPoint, meta) {
    this.#pickupPoint = { ...pickupPoint };
    this.#pickupPointMarker = createPickupPointMarker(this.#pickupPoint);
    this.#dropPoint = { ...dropPoint };
    this.#dropPointMarker = createDropPointMarker(this.#dropPoint);
    this.#distanceLine = createDistanceLine(this.#pickupPoint, this.#dropPoint);
    this.#driverPoint = driverPoint ? { ...driverPoint } : null;
    if (this.#driverPoint) {
      this.#driverPointMarker = createDriverPointMarker(this.#driverPoint);
    } else {
      // NOTE: driverPoint 정보가 없는 경우에는 driverPoint를 pickupPoint 위치로 임시로 둠
      this.#driverPointMarker = createDriverPointMarker(this.#pickupPoint);
    }
    this.#meta = meta;
  }

  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    this.#pickupPointMarker.draw(map);
    this.#dropPointMarker.draw(map);
    this.#distanceLine.draw(map);
    this.#driverPointMarker.draw(map);
    if (!this.#driverPoint) {
      this.#driverPointMarker.setVisible(false);
    }
  }

  remove() {
    this.#pickupPointMarker.remove();
    this.#dropPointMarker.remove();
    this.#distanceLine.remove();
    this.#driverPointMarker.remove();
  }

  /**
   * 픽업지 마커의 위치를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   *
   * @return {void} 반환값 없음
   */
  setPickupPointLatLng({ lat, lng }) {
    if (!utils.isLatitude(lat)) {
      throw new Error(`lat:${lat} / 유효하지 않습니다.`);
    }
    if (!utils.isLongitude(lng)) {
      throw new Error(`lng:${lng} / 유효하지 않습니다.`);
    }
    if (!this.#pickupPointMarker) {
      throw new Error(`this.#pickupPointMarker:${this.#pickupPointMarker} / 유효하지 않습니다.`);
    }
    this.#pickupPoint = {
      ...this.#pickupPoint,
      lat,
      lng,
    };
    this.#pickupPointMarker.setPosition(lat, lng);
    this.#distanceLine.setPath(this.#pickupPoint, this.#dropPoint);
  }

  /**
   * 드랍지 마커의 위치를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   *
   * @return {void} 반환값 없음
   */
  setDropPointLatLng({ lat, lng }) {
    if (!utils.isLatitude(lat)) {
      throw new Error(`lat:${lat} / 유효하지 않습니다.`);
    }
    if (!utils.isLongitude(lng)) {
      throw new Error(`lng:${lng} / 유효하지 않습니다.`);
    }
    if (!this.#dropPointMarker) {
      throw new Error(`this.#dropPointMarker:${this.#dropPointMarker} / 유효하지 않습니다.`);
    }
    this.#dropPoint = {
      ...this.#dropPoint,
      lat,
      lng,
    };
    this.#dropPointMarker.setPosition(lat, lng);
    this.#distanceLine.setPath(this.#pickupPoint, this.#dropPoint);
  }

  /**
   * 드랍지 마커의 위치를 설정합니다.
   * https://navermaps.github.io/maps.js/docs/naver.maps.Marker.html#setPosition__anchor
   *
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   *
   * @return {void} 반환값 없음
   */
  setDriverPointLatLng({ lat, lng }) {
    if (!utils.isLatitude(lat)) {
      throw new Error(`lat:${lat} / 유효하지 않습니다.`);
    }
    if (!utils.isLongitude(lng)) {
      throw new Error(`lng:${lng} / 유효하지 않습니다.`);
    }
    if (!this.#driverPointMarker) {
      throw new Error(`this.#driverPointMarker:${this.#driverPointMarker} / 유효하지 않습니다.`);
    }
    this.#driverPoint = {
      ...this.#driverPoint,
      lat,
      lng,
    };
    this.#driverPointMarker.setPosition(lat, lng);
    this.#driverPointMarker.setVisible(true);
  }

  /**
   * 픽업지, 드랍지, 드라이버의 마커의 bounds를 구합니다.
   *
   * @return {object} bounds 객체
   */
  bounds() {
    return boundHandler.createBoundsByPoints([
      this.#pickupPoint,
      this.#dropPoint,
      this.#driverPoint,
    ]);
  }

  /**
   * distanceLine을 focus시킵니다.
   *
   * @return {void} 반환값 없음
   */
  focus() {
    if (this.#distanceLine) {
      this.#distanceLine.focus();
    }
  }

  /**
   * distanceLine을 blur시킵니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    if (this.#distanceLine) {
      this.#distanceLine.blur();
    }
  }

  /**
   * meta의 복사본을 줍니다.
   *
   * @return {object} meta의 복사본
   */
  get meta() {
    return {
      ...this.#meta,
    };
  }
}

export default {
  create({
    pickupPoint,
    dropPoint,
    driverPoint,
    meta = {},
  }) {
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

    return new PickupDropPoints(pickupPoint, dropPoint, driverPoint, meta);
  },
};
