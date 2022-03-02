import customControlButtonGroupHandler from '../customControlButtonGroupHandler';

class HexagonSelector {
  #customControlButtonGroup

  #meta

  #map

  constructor({
    meta,
  }) {
    // eslint-disable-next-line max-len
    this.#customControlButtonGroup = customControlButtonGroupHandler.createCustomControlButtonGroup({ meta });
    this.#meta = meta;
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
    this.#customControlButtonGroup.setNaverMap(this.#map);
    this.#customControlButtonGroup.draw(this.#map);
  }

  /**
   * hexagonSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#customControlButtonGroup) {
      this.#customControlButtonGroup.remove();
    }
  }

  /**
   * hexagonSelector 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#customControlButtonGroup) {
      this.#customControlButtonGroup.destroy();
    }
    this.#customControlButtonGroup = null;

    this.#meta = null;
    this.#map = null;
  }
}

export default {
  createHexagonSelector({
    meta = {},
  }) {
    return new HexagonSelector({ meta });
  },
};
