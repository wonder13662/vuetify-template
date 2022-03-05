import customControlGroupHandler from '../customControlGroupHandler';
import customControlBanner from '../customControlGroupHandler/customControlBanner';

const SELECT_METHOD_POINT = 'SELECT_METHOD_POINT';
const SELECT_METHOD_POLYILNE = 'SELECT_METHOD_POLYILNE';
const SELECT_METHOD_POLYGON = 'SELECT_METHOD_POLYGON';
const SELECT_METHOD_NOTHING = 'SELECT_METHOD_NOTHING';
class HexagonSelector {
  #hexagonSelectorButtonGroup

  #banner

  #meta

  #map

  #selectMethod

  constructor({
    meta,
  }) {
    // eslint-disable-next-line max-len
    this.#meta = meta;
    this.#selectMethod = SELECT_METHOD_NOTHING;
    // eslint-disable-next-line max-len
    this.#hexagonSelectorButtonGroup = customControlGroupHandler.createCustomControlHexagonSelectorButtonGroup({
      meta: this.#meta,
      onSelectedPoint: () => {
        this.#selectMethod = SELECT_METHOD_POINT;
        this.updateBannerPoint();
        this.#banner.forceUpdate();
      },
      onSelectedPolyline: () => {
        this.#selectMethod = SELECT_METHOD_POLYILNE;
        this.updateBannerPolyline();
        this.#banner.forceUpdate();
      },
      onSelectedPolygon: () => {
        this.#selectMethod = SELECT_METHOD_POLYGON;
        this.updateBannerPolygon();
        this.#banner.forceUpdate();
      },
      onSelectedNone: () => {
        this.#selectMethod = SELECT_METHOD_NOTHING;
        this.updateBannerNone();
        this.#banner.forceUpdate();
      },
    });
    this.#banner = customControlBanner.createCustomControlBanner({ meta });
    this.updateBannerNone();
  }

  /**
   * banner 상태를 포인트 선택으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerPoint() {
    this.#banner.setBannerText('Hexagon을 점을 지정해서 선택해주세요.');
    this.#banner.setVisibleBtnSave(true);
    this.#banner.setVisibleBtnCancel(true);
  }

  /**
   * banner 상태를 폴리곤 선택으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerPolyline() {
    this.#banner.setBannerText('Hexagon을 직선을 그려서 선택해주세요.');
    this.#banner.setVisibleBtnSave(true);
    this.#banner.setVisibleBtnCancel(true);
  }

  /**
   * banner 상태를 폴리곤 선택으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerPolygon() {
    this.#banner.setBannerText('Hexagon을 폴리곤 범위를 그려서 선택해주세요.');
    this.#banner.setVisibleBtnSave(true);
    this.#banner.setVisibleBtnCancel(true);
  }

  /**
   * banner 상태를 아무것도 없음으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerNone() {
    this.#banner.setBannerText('Hexagon을 선택할 방식(점, 직선, 폴리곤)을 지정해주세요.');
    this.#banner.setVisibleBtnSave(false);
    this.#banner.setVisibleBtnCancel(false);
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
    this.#hexagonSelectorButtonGroup.setNaverMap(this.#map);
    this.#banner.setNaverMap(this.#map);
  }

  /**
   * hexagonSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#hexagonSelectorButtonGroup) {
      this.#hexagonSelectorButtonGroup.remove();
    }
    if (this.#banner) {
      this.#banner.remove();
    }
  }

  /**
   * hexagonSelector 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#hexagonSelectorButtonGroup) {
      this.#hexagonSelectorButtonGroup.destroy();
    }
    this.#hexagonSelectorButtonGroup = null;

    if (this.#banner) {
      this.#banner.destroy();
    }
    this.#banner = null;

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
