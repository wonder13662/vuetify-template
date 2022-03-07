import customControlGroupHandler from '../customControlGroupHandler';
import customControlBanner from '../customControlGroupHandler/customControlBanner';
import hexagonPointSelector from './hexagonPointSelector';
import hexagonPolygonSelector from './hexagonPolygonSelector';
import polygonHandler from '../polygonHandler';
import hexagonCalculator from '../lib/hexagonCalculator';

const MODE = {
  POINT: 'POINT',
  POLYGON: 'POLYGON',
  NONE: 'NONE',
};

class HexagonSelector {
  #hexagonSelectorButtonGroup

  #banner

  #hexagonPointSelector

  #hexagonPolygonSelector

  #meta

  #map

  #h3Indexes

  #selectedPolygon

  #mode

  #disabled

  #visible

  constructor({
    meta,
    disabled = false,
    visible = true,
  }) {
    // eslint-disable-next-line max-len
    this.#meta = { ...meta };
    this.#map = null;
    this.#h3Indexes = [];
    this.#mode = MODE.NONE;
    this.#disabled = disabled;
    this.#visible = visible;
    // 1. 지도 우측 중앙의 점/직선/폴리곤 버튼 그룹
    // eslint-disable-next-line max-len
    this.#hexagonSelectorButtonGroup = customControlGroupHandler.createCustomControlHexagonSelectorButtonGroup({
      meta: this.#meta,
      onSelectedPoint: () => {
        if (this.#disabled) {
          return;
        }

        this.#mode = MODE.POINT;
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
      },
      onSelectedPolygon: () => {
        if (this.#disabled) {
          return;
        }

        this.#mode = MODE.POLYGON;
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
        this.#hexagonPolygonSelector.setH3Indexes(this.#h3Indexes);
      },
    });
    // 2. 지도 상단 중앙의 배너객체
    this.#banner = customControlBanner.createCustomControlBanner({
      meta,
      onClickBtnAdd: () => {
        if (this.#disabled) {
          return;
        }
        if (this.#mode === MODE.POLYGON) {
          this.#hexagonPolygonSelector.add();
        }
      },
      onClickBtnSubtract: () => {
        if (this.#disabled) {
          return;
        }
        if (this.#mode === MODE.POLYGON) {
          this.#hexagonPolygonSelector.subtract();
        }
      },
      onClickBtnSave: () => {
        if (this.#disabled) {
          return;
        }
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

        // 4. 직전에 사용한 selector에서 선택된 h3Index의 배열을 가져와 업데이트한다.
        if (this.#mode === MODE.POINT) {
          this.#h3Indexes = this.#hexagonPointSelector.getH3Indexes();
        } else if (this.#mode === MODE.POLYGON) {
          this.#h3Indexes = this.#hexagonPolygonSelector.getH3Indexes();
        }
        // 5. 지도에 지금까지 선택된 h3Index들의 폴리곤을 그린다.
        this.updateSelectedH3Indexes();

        // 6-1. hexagon point selector에 저장된 데이터를 모두 삭제
        this.#hexagonPointSelector.clear();
        this.#hexagonPointSelector.setDisabled(true);
        // 6-2. hexagon polygon selector에 저장된 데이터를 모두 삭제
        this.#hexagonPolygonSelector.clear();
        this.#hexagonPolygonSelector.setDisabled(true);
        // 7. 모든 작업을 마치고 모드를 상태없음(NONE)으로 바꾼다.
        this.#mode = MODE.NONE;
      },
      onClickBtnCancel: () => {
        if (this.#disabled) {
          return;
        }
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
        // 5. 모든 작업을 마치고 모드를 상태없음(NONE)으로 바꾼다.
        this.#mode = MODE.NONE;
      },
    });
    this.updateBannerNone();
    // 3. 실제 h3Index를 선택하게 도와주는 selector들
    // 3-1. 사용자 클릭에 h3Index를 하나씩 넣고 빼는 point selector
    this.#hexagonPointSelector = hexagonPointSelector.createHexagonPointSelector({
      meta: { ...this.#meta },
    });
    // 3-2. 폴리곤을 지도에 직접 그려서 영역에 걸쳐있는 h3Index를 넣고 빼는 polygon selector
    this.#hexagonPolygonSelector = hexagonPolygonSelector.createHexagonPolygonSelector({
      meta: { ...this.#meta },
    });
    this.disableAllHexagonSelector();
    // 4. 선택된 h3Index를 표시하는 polygon 객체 만들기
    this.#selectedPolygon = polygonHandler.createPolygon({
      clickable: false,
      meta: { ...this.#meta },
    });
    this.#selectedPolygon.setModeSelected();
  }

  /**
   * 지도에 선택된 h3Index를 폴리곤으로 표시
   *
   * @return {void} 리턴값 없음
   */
  updateSelectedH3Indexes() {
    const paths = hexagonCalculator.getPathsFromH3Indexes(this.#h3Indexes);
    this.#selectedPolygon.setPaths(paths);
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
    this.#banner.setVisibleBtnSave(true);
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
    this.#banner.setVisibleBtnSave(true);
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
    // NOTE: 네이버 맵 객체를 넘겨주는 순서대로 지도에 그려진다.
    // 가장 마지막에 지도에 그려진 객체가 최상위로 올라간다.
    // TODO z-index로 가장 상위에 있는 엘리먼트가 이벤트를 처리할 것이라 예상했지만 그렇게 동작하지는 않음.
    this.#hexagonSelectorButtonGroup.setNaverMap(this.#map);
    this.#banner.setNaverMap(this.#map);
    this.#selectedPolygon.setNaverMap(this.#map);
    this.#hexagonPointSelector.setNaverMap(this.#map);
    this.#hexagonPolygonSelector.setNaverMap(this.#map);
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

  /**
   * 전체 기능의 비활성화 여부를 설정합니다.
   *
   * @param {boolean} disabled - 전체 기능의 비활성화 여부
   *
   * @return {void} 리턴값 없음
   */
  setDisabled(disabled) {
    this.#disabled = disabled;
    this.#hexagonSelectorButtonGroup.setDisabled(this.#disabled);
    this.#banner.setDisabled(this.#disabled);
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
    this.#hexagonSelectorButtonGroup.setVisible(this.#visible);
    this.#banner.setVisible(this.#visible);
  }
}

export default {
  createHexagonSelector({
    meta = {},
    disabled = false,
    visible = true,
  }) {
    return new HexagonSelector({
      meta,
      disabled,
      visible,
    });
  },
};
