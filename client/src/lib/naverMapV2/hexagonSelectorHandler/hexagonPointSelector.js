import {
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
} from 'h3-js';
import overlayEventHandler from '../overlayEventHandler';
import {
  H3_RESOLUTION,
} from '../lib/constants';
import polygonHandler from '../polygonHandler';
import utils from '@/lib/utils';
import mapUtils from '../lib/utils';
import hexagonCalculator from '../lib/hexagonCalculator';

class HexagonPointSelector {
  #meta

  #map

  #overlayMapEventHandler

  #h3Resolution

  #h3IndexSet

  #disabled

  #selectedPolygon

  #mousemovePolygon

  #mousemovePoint

  #onChange

  constructor({
    meta = {},
    onChange = () => ({}),
    h3Resolution = H3_RESOLUTION,
  }) {
    this.#meta = meta;
    this.#h3Resolution = h3Resolution;
    this.#disabled = false;
    this.#h3IndexSet = new Set();
    this.#mousemovePoint = null;
    this.#onChange = onChange;
    this.#overlayMapEventHandler = overlayEventHandler.createOverlayEventController({
      onMousemove: ({ point }) => {
        if (this.#disabled) {
          return;
        }
        if (mapUtils.isSameH3IndexByPoints(this.#mousemovePoint, point, this.#h3Resolution)) {
          return;
        }
        this.#mousemovePoint = point;
        this.updateMouseoverPolygonPath(point);
      },
      meta: { ...this.#meta },
    });
    this.#selectedPolygon = polygonHandler.createPolygon({
      meta: this.#meta,
    });
    this.#selectedPolygon.addClickListener(({ point }) => {
      if (this.#disabled) {
        return;
      }
      this.addPointToH3IndexSet(point);
      this.updateSelectedPolygonPath();
      this.emit();
    });
    this.#selectedPolygon.addMousemoveListener(({ point }) => {
      if (mapUtils.isSameH3IndexByPoints(this.#mousemovePoint, point, this.#h3Resolution)) {
        return;
      }
      this.#mousemovePoint = point;
      this.updateMouseoverPolygonPath(point);
    });
    this.#mousemovePolygon = polygonHandler.createPolygon({
      meta: this.#meta,
    });
    this.#mousemovePolygon.addClickListener(({ point }) => {
      if (this.#disabled) {
        return;
      }
      this.addPointToH3IndexSet(point);
      this.updateSelectedPolygonPath();
      this.emit();
    });
  }

  /**
   * h3Indexes를 인자로 받아 h3IndexSet을 업데이트합니다.
   * h3IndexSet을 초기화한 뒤에 업데이트합니다.
   *
   * @param {array<String>} h3Indexes 문자열 h3Index의 배열
   *
   * @return {void} 리턴값 없음
   */
  setH3IndexSetByH3Indexes(h3Indexes) {
    this.#h3IndexSet = new Set();
    if (!h3Indexes) {
      return;
    }
    h3Indexes.forEach((v) => {
      this.#h3IndexSet.add(v);
    });
  }


  /**
   * 마우스 이벤트로 발생한 데이터를 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  clear() {
    this.#h3IndexSet = [];
    this.#mousemovePoint = null;
    this.#selectedPolygon.setPaths([]);
    this.#mousemovePolygon.setPaths([]);
  }

  /**
   * 주의: 이 메서드는 외부에서 호출해서는 안됩니다.
   * onChange 콜백함수를 호출하는 메서드입니다.
   *
   * @return {void} 리턴값 없음
   */
  emit() {
    const h3Indexes = utils.convertSetToList(this.#h3IndexSet);
    this.#onChange({ h3Indexes });
  }

  /**
   * 사용자가 mousemove한 좌표로 polygon을 표시합니다.
   * 추가 혹은 삭제할 수 있는 영역을 보여줍니다.
   *
   * @param {Point} point lat, lng를 속성으로 가지는 Point 객체
   *
   * @return {void} 리턴값 없음
   */
  updateMouseoverPolygonPath(point) {
    if (!mapUtils.isValidPoint(point)) {
      throw new Error(`updateMouseoverPolygonPath/point:${point}/유효하지 않습니다.`);
    }
    const h3Index = geoToH3(point.lat, point.lng, this.#h3Resolution);
    const paths = hexagonCalculator.getPathsFromH3Indexes([h3Index]);
    this.#mousemovePolygon.setPaths(paths);
  }

  /**
   * h3IndexSet으로 polygon의 path를 업데이트합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateSelectedPolygonPath() {
    const h3Indexes = utils.convertSetToList(this.#h3IndexSet);
    const paths = hexagonCalculator.getPathsFromH3Indexes(h3Indexes);
    this.#selectedPolygon.setPaths(paths);
  }

  /**
   * 사용자가 클릭한 point로 h3IndexSet을 업데이트합니다.
   *
   * @param {Point} point lat, lng 속성을 가지는 Point 객체
   *
   * @return {void} 리턴값 없음
   */
  addPointToH3IndexSet(point) {
    if (!mapUtils.isValidPoint(point)) {
      throw new Error(`addPointToH3IndexSet/point:${point}/유효하지 않습니다.`);
    }
    const h3Index = geoToH3(point.lat, point.lng, this.#h3Resolution);

    if (this.#h3IndexSet.has(h3Index)) {
      this.#h3IndexSet.delete(h3Index);
    } else {
      this.#h3IndexSet.add(h3Index);
    }
  }

  /**
   * Naver Map 인스턴스를 받습니다.
   *
   * @param {object} map - (required)네이버 맵 객체
   *
   * @return {void} 리턴값 없음
   */
  setNaverMap(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    if (this.#map) {
      return;
    }
    this.#map = map;
    this.#overlayMapEventHandler.setOverlay(this.#map);
    this.#selectedPolygon.setNaverMap(this.#map);
    this.#mousemovePolygon.setNaverMap(this.#map);
  }

  /**
   * hexagonPointSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#overlayMapEventHandler) {
      this.#overlayMapEventHandler.remove();
    }
    if (this.#selectedPolygon) {
      this.#selectedPolygon.remove();
    }
    if (this.#mousemovePolygon) {
      this.#mousemovePolygon.remove();
    }
  }

  /**
   * hexagonPointSelector 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    this.#map = null;
    this.#overlayMapEventHandler = null;
    if (this.#selectedPolygon) {
      this.#selectedPolygon.destroy();
    }
    this.#selectedPolygon = null;
    if (this.#mousemovePolygon) {
      this.#mousemovePolygon.destroy();
    }
    this.#mousemovePolygon = null;
  }

  /**
   * 전체 기능의 비활성화 여부를 설정합니다.
   *
   * @param {boolean} disabled - 전체 기능의 비활성화 여부
   *
   * @return {void} 리턴값 없음
   */
  setDisabled(disabled) {
    this.#disabled = disabled;
  }

  /**
   * 전체 기능의 비활성화 여부를 가져옵니다.
   *
   * @return {boolean} 전체 기능의 비활성화 여부
   */
  getDisabled() {
    return this.#disabled;
  }
}

export default {
  createHexagonPointSelector({
    meta = {},
    onChange = () => ({}),
  }) {
    return new HexagonPointSelector({
      meta,
      onChange,
    });
  },
};
