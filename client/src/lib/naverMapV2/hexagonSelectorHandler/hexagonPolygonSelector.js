import hexagonLassoHandler from '../hexagonLassoHandler';

class HexagonPolygonSelector {
  #meta

  #map

  #hexagonLasso

  #disabled

  constructor({
    meta,
  }) {
    this.#meta = meta;
    this.#disabled = false;
    this.#hexagonLasso = hexagonLassoHandler.createHexagonLasso({
      meta: this.#meta,
    });
    // TODO 모드를 없애야 함
    this.#hexagonLasso.setModeEdit();
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
    this.#hexagonLasso.setNaverMap(this.#map);
  }

  /**
   * hexagonPointSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#hexagonLasso) {
      this.#hexagonLasso.remove();
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
    if (this.#hexagonLasso) {
      this.#hexagonLasso.destroy();
    }
    this.#hexagonLasso = null;
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
    this.#hexagonLasso.setDisabled(disabled);
  }

  /**
   * 전체 기능의 비활성화 여부를 가져옵니다.
   *
   * @return {boolean} 전체 기능의 비활성화 여부
   */
  getDisabled() {
    return this.#disabled;
  }

  /**
   * 외부에서 전달받은 데이터와 이벤트로부터 만들어낸 데이터로 초기화합니다.
   *
   * @return {void} 리턴값 없음
   */
  clear() {
    this.#hexagonLasso.clear();
  }

  /**
   * 선택된 h3Index의 배열을 줍니다.
   *
   * @return {array<String>} 문자열 h3Index 배열
   */
  getH3Indexes() {
    return this.#hexagonLasso.getH3Indexes();
  }
}

export default {
  createHexagonPolygonSelector({ meta }) {
    return new HexagonPolygonSelector({ meta });
  },
};
