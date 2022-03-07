import customControlGroupHandler from '../customControlGroupHandler';
import customControlBanner from '../customControlGroupHandler/customControlBanner';
import hexagonPointSelector from './hexagonPointSelector';
import hexagonPolygonSelector from './hexagonPolygonSelector';
import polygonHandler from '../polygonHandler';
import hexagonCalculator from '../lib/hexagonCalculator';

class HexagonSelector {
  #hexagonSelectorButtonGroup

  #banner

  #hexagonPointSelector

  #hexagonPolygonSelector

  #meta

  #map

  #h3Indexes

  #selectedPolygon

  constructor({
    meta,
  }) {
    // eslint-disable-next-line max-len
    this.#meta = meta;
    this.#map = null;
    this.#h3Indexes = [];
    // 1. 지도 우측 중앙의 점/직선/폴리곤 버튼 그룹
    // eslint-disable-next-line max-len
    this.#hexagonSelectorButtonGroup = customControlGroupHandler.createCustomControlHexagonSelectorButtonGroup({
      meta: this.#meta,
      onSelectedPoint: () => {
        // 1. 지도 상단 중앙 Banner 업데이트
        this.updateBannerPoint();
        this.#banner.forceUpdate();
        // 2. 지도 우측 중앙 Buttons 업데이트
        this.#hexagonSelectorButtonGroup.setDisabled(true);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        // 3. 모든 hexagon selector를 disabled 처리
        this.disableAllHexagonSelector();
        // 4. 선택된 hexagon point selector를 활성화함
        this.#hexagonPointSelector.setDisabled(false);
        this.#hexagonPointSelector.setH3IndexSetByH3Indexes(this.#h3Indexes);
        this.#hexagonPointSelector.updateSelectedPolygonPath();
        // 5. 화면에 표시되었던 h3Index polygon을 지도에서 숨김
        this.hideSelectedH3Indexes();
      },
      onSelectedPolygon: () => {
        // 1. 지도 상단 중앙 Banner 업데이트
        this.updateBannerPolygon();
        this.#banner.forceUpdate();
        // 2. 지도 우측 중앙 Buttons 업데이트
        this.#hexagonSelectorButtonGroup.setDisabled(true);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        // 3. 모든 hexagon selector를 disabled 처리
        this.disableAllHexagonSelector();
        // 4. 선택된 hexagon polygon selector를 활성화함
        this.#hexagonPolygonSelector.setDisabled(false);
        // 5. 화면에 표시되었던 h3Index polygon을 지도에서 숨김
        this.hideSelectedH3Indexes();
      },
      onSelectedNone: () => { // REMOVE ME
        // 1. 지도 상단 중앙 Banner 업데이트
        this.updateBannerNone();
        this.#banner.forceUpdate();
        // 2. 지도 우측 중앙 Buttons 업데이트
        this.#hexagonSelectorButtonGroup.setDisabled(false);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        // 3. 모든 hexagon selector를 disabled 처리
        this.disableAllHexagonSelector();
      },
    });
    // 2. 지도 상단 중앙의 배너객체
    this.#banner = customControlBanner.createCustomControlBanner({
      meta,
      onClickBtnAdd: () => {
        // eslint-disable-next-line no-console
        console.log('onClickBtnAdd / 선택한 hexagon을 hexagonMap에 추가합니다.');
      },
      onClickBtnSubtract: () => {
        // eslint-disable-next-line no-console
        console.log('onClickBtnSubtract / 선택한 hexagon을 hexagonMap에서 제거합니다.');
      },
      onClickBtnCancel: () => {
        // eslint-disable-next-line no-console
        console.log('onClickBtnCancel / 작업을 중단합니다.');
        // TODO 사용자에게 confirm 모달을 띄워야 합니다.(banner가 담당해야 할 수 있음)
        // 1. 지도 상단 중앙 Banner 업데이트
        this.updateBannerNone();
        this.#banner.forceUpdate();
        // 2. 지도 우측 중앙 Buttons 업데이트
        this.#hexagonSelectorButtonGroup.setDisabled(false);
        this.#hexagonSelectorButtonGroup.setSelectedNone();
        this.#hexagonSelectorButtonGroup.forceUpdate();
        // 3. 모든 hexagon selector를 disabled 처리
        this.disableAllHexagonSelector();
        // 4-1. hexagon point selector에 저장된 데이터를 모두 삭제
        this.#hexagonPointSelector.clear();
        this.#hexagonPointSelector.setDisabled(true);
        // 4-2. hexagon polygon selector에 저장된 데이터를 모두 삭제
        this.#hexagonPolygonSelector.clear();
        this.#hexagonPolygonSelector.setDisabled(true);
        // 5. 지도에 지금까지 선택된 h3Index들의 폴리곤을 그린다.
        this.showSelectedH3Indexes();
      },
    });
    this.updateBannerNone();
    // 3. 실제 h3Index를 선택하게 도와주는 selector들
    // 3-1. 사용자 클릭에 h3Index를 하나씩 넣고 빼는 point selector
    this.#hexagonPointSelector = hexagonPointSelector.createHexagonPointSelector({
      meta,
      onChange: ({ h3Indexes }) => {
        this.#h3Indexes = h3Indexes;
        // TODO 화면에 h3Index의 polygon을 그립니다.
      },
    });
    // 3-2. 폴리곤을 지도에 직접 그려서 영역에 걸쳐있는 h3Index를 넣고 빼는 polygon selector
    this.#hexagonPolygonSelector = hexagonPolygonSelector.createHexagonPolygonSelector({ meta });
    this.disableAllHexagonSelector();
    // 4. 선택된 h3Index를 표시하는 polygon 객체 만들기
    this.#selectedPolygon = polygonHandler.createPolygon({
      clickable: false,
      meta: this.#meta,
    });
  }

  /**
   * 지도에 선택된 h3Index를 폴리곤으로 표시
   *
   * @return {void} 리턴값 없음
   */
  showSelectedH3Indexes() {
    const paths = hexagonCalculator.getPathsFromH3Indexes(this.#h3Indexes);
    this.#selectedPolygon.setPaths(paths);
  }

  /**
   * 지도에 선택된 h3Index를 나타내는 폴리곤을 숨김
   *
   * @return {void} 리턴값 없음
   */
  hideSelectedH3Indexes() {
    this.#selectedPolygon.setPaths([]);
  }

  /**
   * 모든 selector를 비활성상태로 바꿉니다.
   *
   * @return {void} 리턴값 없음
   */
  disableAllHexagonSelector() {
    this.#hexagonPointSelector.setDisabled(true);
    this.#hexagonPolygonSelector.setDisabled(true);
  }

  /**
   * banner 상태를 포인트 선택으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerPoint() {
    this.#banner.setBannerText('지도 위에 원하는 곳을 클릭해서 Hexagon을 선택해주세요.');
    this.#banner.setVisibleBtnAdd(false);
    this.#banner.setVisibleBtnSubtract(false);
    this.#banner.setVisibleBtnCancel(true);
  }

  /**
   * banner 상태를 폴리곤 선택으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerPolygon() {
    this.#banner.setBannerText('지도 위에 폴리곤 범위를 그려서 Hexagon을 선택해주세요.');
    this.#banner.setVisibleBtnAdd(true);
    this.#banner.setVisibleBtnSubtract(true);
    this.#banner.setVisibleBtnCancel(true);
  }

  /**
   * banner 상태를 아무것도 없음으로 표시합니다.
   *
   * @return {void} 리턴값 없음
   */
  updateBannerNone() {
    this.#banner.setBannerText('Hexagon을 선택할 방식(점, 폴리곤)을 선택해주세요.');
    this.#banner.setVisibleBtnAdd(false);
    this.#banner.setVisibleBtnSubtract(false);
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
    this.#hexagonPointSelector.setNaverMap(this.#map);
    this.#hexagonPolygonSelector.setNaverMap(this.#map);
    this.#selectedPolygon.setNaverMap(this.#map);
    this.#selectedPolygon.draw(this.#map);
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
    if (this.#hexagonPointSelector) {
      this.#hexagonPointSelector.remove();
    }
    if (this.#hexagonPolygonSelector) {
      this.#hexagonPolygonSelector.remove();
    }
    if (this.#selectedPolygon) {
      this.#selectedPolygon.remove();
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

    if (this.#hexagonPointSelector) {
      this.#hexagonPointSelector.destroy();
    }
    this.#hexagonPointSelector = null;

    if (this.#hexagonPolygonSelector) {
      this.#hexagonPolygonSelector.destroy();
    }
    this.#hexagonPolygonSelector = null;

    if (this.#selectedPolygon) {
      this.#selectedPolygon.destroy();
    }
    this.#selectedPolygon = null;

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
