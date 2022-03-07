import polygonLassoHandler from '../polygonLassoHandler';
import polygonHandler from '../polygonHandler';
import hexagonCalculator from '../lib/hexagonCalculator';

class HexagonLasso {
  #map

  #polygonLasso

  #polygonHexagonGroup

  #h3Indexes

  #points

  #disabled

  #meta

  /**
   * TODO Points를 받아 네이버 지도 위에서 영역을 나타내는 폴리곤을 그립니다.
   * 사용자는 폴리곤의 점들을 선택하여 이동,삭제할 수 있습니다.
   * 사용자는 폴리곤 바깥의 영역을 클릭하여 폴리곤에 점을 추가할 수 있습니다.
   * 이 폴리곤을 구성하는 point들을 가지고 hexagonGroup을 그립니다.
   *
   * @param {object} meta - (optional)마커의 메타정보
   * @param {function} onChange - (optional)point가 추가되거나 제거될 때 호출되는 콜백
   *
   * @return {Polygon} Polygon의 인스턴스
   */
  constructor({
    onChange = () => ({}),
    meta = {},
  }) {
    this.#meta = meta;
    this.#map = null;
    this.#disabled = false;
    this.#points = [];
    this.#h3Indexes = [];
    this.#polygonLasso = polygonLassoHandler.createPolygonLasso({
      meta,
      onChange: ({ points }) => {
        if (this.#disabled) {
          return;
        }
        this.#points = points;
        this.#h3Indexes = hexagonCalculator.convertPointsToH3Indexes(points);
        if (!this.#h3Indexes || this.#h3Indexes.length === 0) {
          this.#polygonHexagonGroup.remove();
          onChange({ h3Indexes: [] });
          return;
        }

        const paths = hexagonCalculator.getPathsFromH3Indexes(this.#h3Indexes);
        this.#polygonHexagonGroup.setPathByPoints(paths[0]);
        onChange({ h3Indexes: [...this.#h3Indexes] });
      },
    });
    this.#polygonHexagonGroup = polygonHandler.createPolygon({
      points: this.#points,
      clickable: false,
    });
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
    this.#polygonLasso.setNaverMap(this.#map);
    this.#polygonHexagonGroup.setNaverMap(this.#map);
  }

  /**
   * 네이버 맵 위에 HexagonLasso를 지웁니다.
   * Overlay 타입의 필수 구현 메서드입니다.
   *
   * @return {void} 리턴값 없음
   */
  remove() {
    this.#polygonLasso.remove();
    this.#polygonHexagonGroup.remove();
  }

  /**
   * HexagonLasso 객체를 삭제합니다.
   * 관련 필드를 모두 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    this.#polygonLasso.destroy();
    this.#polygonLasso = null;
    this.#polygonHexagonGroup.destroy();
    this.#polygonHexagonGroup = null;
    this.#meta = null;
    this.#map = null;
  }

  /**
   * 읽기모드(MODE_READ)로 바꿉니다.
   *
   * @return {void} 반환값 없음
   */
  setModeRead() {
    this.#polygonLasso.setModeRead();
  }

  /**
   * 편집모드(MODE_EDIT)로 바꿉니다.
   *
   * @return {void} 반환값 없음
   */
  setModeEdit() {
    this.#polygonLasso.setModeEdit();
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
    this.#polygonLasso.setDisabled(this.#disabled);
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
    this.#polygonLasso.clear();
    this.#polygonHexagonGroup.setPaths([]);
    this.#h3Indexes = [];
    this.#points = [];
  }
}

export default {
  createHexagonLasso({
    onChange = () => ({}),
    meta = {},
  }) {
    return new HexagonLasso({
      onChange,
      meta,
    });
  },
};
