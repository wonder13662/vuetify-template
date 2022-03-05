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

// TODO
// 1. 맵을 전달받아 overlayEventListener에 등록하여 클릭 이벤트를 받아야 한다
// 2. 사용자가 클릭한 좌표를 받을 수 있어야 함
// 3. 사용자가 클릭해서 추가한 좌표들을 관리해야 함
// 3-1. 좌표들을 맵으로 추가해 관리
// 4. H3 Resolution은 외부에서 설정 가능해야 함
// 5. 분리된 영역에서도 클릭이 가능해야 함

class HexagonPointSelector {
  #meta

  #map

  #overlayEventHandler

  #h3Resolution

  #h3IndexSet

  #disabled

  #polygon

  constructor({
    meta,
    h3Resolution = H3_RESOLUTION,
  }) {
    this.#meta = meta;
    this.#h3Resolution = h3Resolution;
    this.#disabled = false;
    this.#h3IndexSet = new Set();
    this.#overlayEventHandler = overlayEventHandler.createOverlayEventController({
      onClick: ({ point }) => {
        if (this.#disabled) {
          return;
        }
        this.addPointToH3IndexSet(point);
        this.updatePolygonPath();
      },
      meta: { ...this.#meta },
    });
    this.#polygon = polygonHandler.createPolygon({
      meta: this.#meta,
    });
    this.#polygon.addClickListener(({ point }) => {
      if (this.#disabled) {
        return;
      }
      this.addPointToH3IndexSet(point);
      this.updatePolygonPath();
    });
  }

  /**
   * h3IndexSet으로 polygon의 path를 업데이트합니다.
   *
   * @return {void} 리턴값 없음
   */
  updatePolygonPath() {
    const h3Indexes = utils.convertSetToList(this.#h3IndexSet);
    const paths = mapUtils.getPathsFromH3Indexes(h3Indexes);
    this.#polygon.setPaths(paths);
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
    this.#overlayEventHandler.setOverlay(this.#map);
    this.#polygon.setNaverMap(this.#map);
    this.#polygon.draw(this.#map);
  }

  /**
   * hexagonPointSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#overlayEventHandler) {
      this.#overlayEventHandler.remove();
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
    this.#overlayEventHandler = null;
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
  createHexagonPointSelector({ meta }) {
    return new HexagonPointSelector({ meta });
  },
};
