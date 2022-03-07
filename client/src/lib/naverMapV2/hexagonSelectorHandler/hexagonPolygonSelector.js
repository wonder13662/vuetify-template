import hexagonLassoHandler from '../hexagonLassoHandler';
import polygonHandler from '../polygonHandler';
import utils from '@/lib/utils';

class HexagonPolygonSelector {
  #meta

  #map

  #disabled

  #visible

  #hexagonLasso

  #selectedPolygon

  #h3Indexes

  constructor({
    meta,
  }) {
    this.#meta = { ...meta };
    this.#map = null;
    this.#disabled = false;
    this.#visible = true;
    this.#hexagonLasso = hexagonLassoHandler.createHexagonLasso({
      meta: this.#meta,
    });
    this.#hexagonLasso.setModeEdit();
    this.#selectedPolygon = polygonHandler.createPolygon({
      meta: {
        ...this.#meta,
      },
      clickable: false,
    });
    this.#h3Indexes = [];
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
    this.#selectedPolygon.setNaverMap(this.#map);
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
    if (this.#selectedPolygon) {
      this.#selectedPolygon.remove();
    }
  }

  /**
   * hexagonPointSelector 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();

    if (this.#hexagonLasso) {
      this.#hexagonLasso.destroy();
    }
    this.#hexagonLasso = null;

    if (this.#selectedPolygon) {
      this.#selectedPolygon.destroy();
    }
    this.#selectedPolygon = null;

    this.#map = null;
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
   * 지도 위의 노출 여부를 설정합니다.
   *
   * @param {boolean} visible - 지도 위의 노출 여부
   *
   * @return {void} 리턴값 없음
   */
  setVisible(visible) {
    this.#visible = visible;
  }

  /**
   * 외부에서 전달받은 데이터와 이벤트로부터 만들어낸 데이터로 초기화합니다.
   *
   * @return {void} 리턴값 없음
   */
  clear() {
    this.#hexagonLasso.clear();
    this.#selectedPolygon.setPaths([]);
  }

  /**
   * 선택된 h3Index의 배열을 h3Indexex에 더합니다.
   *
   * @return {void} 리턴값 없음
   */
  add() {
    const current = this.#h3Indexes;
    const incoming = this.#hexagonLasso.getH3Indexes();
    this.#h3Indexes = utils.lodashUnion(current, incoming);
    this.#selectedPolygon.setPathsByH3Indexes(this.#h3Indexes);
    this.#hexagonLasso.clear();
  }

  /**
   * 선택된 h3Index의 배열을 h3Indexex에서 뺍니다.
   *
   * @return {void} 리턴값 없음
   */
  subtract() {
    const current = this.#h3Indexes;
    const incoming = this.#hexagonLasso.getH3Indexes();
    this.#h3Indexes = utils.lodashWithout(current, incoming);
    this.#selectedPolygon.setPathsByH3Indexes(this.#h3Indexes);
    this.#hexagonLasso.clear();
  }

  /**
   * 선택된 h3Index의 배열을 줍니다.
   *
   * @return {array<String>} 문자열 h3Index 배열
   */
  getH3Indexes() {
    return this.#h3Indexes;
  }

  /**
   * h3Index의 배열을 설정합니다.
   *
   * @return {void} 리턴값 없음
   */
  setH3Indexes(h3Indexes) {
    this.#h3Indexes = h3Indexes;
    this.#selectedPolygon.setPathsByH3Indexes(this.#h3Indexes);
  }
}

export default {
  createHexagonPolygonSelector({ meta }) {
    return new HexagonPolygonSelector({ meta });
  },
};
