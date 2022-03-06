import customControlGroupHandler from '../customControlGroupHandler';
import customControlBanner from '../customControlGroupHandler/customControlBanner';
import hexagonPointSelector from './hexagonPointSelector';
import hexagonLineSelector from './hexagonLineSelector';
import hexagonPolygonSelector from './hexagonPolygonSelector';
import polygonHandler from '../polygonHandler';
import mapUtils from '../lib/utils';

const SELECT_METHOD_POINT = 'SELECT_METHOD_POINT';
const SELECT_METHOD_POLYILNE = 'SELECT_METHOD_POLYILNE';
const SELECT_METHOD_POLYGON = 'SELECT_METHOD_POLYGON';
const SELECT_METHOD_NOTHING = 'SELECT_METHOD_NOTHING';
class HexagonSelector {
  #hexagonSelectorButtonGroup

  #banner

  #hexagonPointSelector

  #hexagonLineSelector

  #hexagonPolygonSelector

  #meta

  #map

  #h3Indexes

  #selectedPolygon

  #selectMethod // TODO hexagon 선택로직 연동 뒤에 필요하지 않다면 삭제

  constructor({
    meta,
  }) {
    // eslint-disable-next-line max-len
    this.#meta = meta;
    this.#selectMethod = SELECT_METHOD_NOTHING;
    this.#map = null;
    this.#h3Indexes = [];
    // 1. 지도 우측 중앙의 점/직선/폴리곤 버튼 그룹
    // eslint-disable-next-line max-len
    this.#hexagonSelectorButtonGroup = customControlGroupHandler.createCustomControlHexagonSelectorButtonGroup({
      meta: this.#meta,
      onSelectedPoint: () => {
        this.#selectMethod = SELECT_METHOD_POINT;
        this.updateBannerPoint();
        this.#banner.forceUpdate();
        this.#hexagonSelectorButtonGroup.setDisabled(true);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        this.disableAllSelector();
        this.#hexagonPointSelector.setDisabled(false);
        this.#hexagonPointSelector.setH3IndexSetByH3Indexes(this.#h3Indexes);
        this.#hexagonPointSelector.updateSelectedPolygonPath();
        this.hideSelectedH3Indexes();
      },
      onSelectedPolyline: () => {
        this.#selectMethod = SELECT_METHOD_POLYILNE;
        this.updateBannerPolyline();
        this.#banner.forceUpdate();
        this.#hexagonSelectorButtonGroup.setDisabled(true);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        this.disableAllSelector();
        this.#hexagonLineSelector.setDisabled(false);
        this.hideSelectedH3Indexes();
      },
      onSelectedPolygon: () => {
        this.#selectMethod = SELECT_METHOD_POLYGON;
        this.updateBannerPolygon();
        this.#banner.forceUpdate();
        this.#hexagonSelectorButtonGroup.setDisabled(true);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        this.disableAllSelector();
        this.#hexagonPolygonSelector.setDisabled(false);
        this.hideSelectedH3Indexes();
      },
      onSelectedNone: () => {
        this.#selectMethod = SELECT_METHOD_NOTHING;
        this.updateBannerNone();
        this.#banner.forceUpdate();
        this.#hexagonSelectorButtonGroup.setDisabled(false);
        this.#hexagonSelectorButtonGroup.forceUpdate();
        this.disableAllSelector();
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
        this.#selectMethod = SELECT_METHOD_NOTHING;
        this.updateBannerNone();
        this.#banner.forceUpdate();
        this.#hexagonSelectorButtonGroup.setDisabled(false);
        this.#hexagonSelectorButtonGroup.setSelectedNone();
        this.#hexagonSelectorButtonGroup.forceUpdate();
        this.disableAllSelector();
        // TODO 모든 selector가 clear, setDisabled를 구현해야 함!
        this.#hexagonPointSelector.clear();
        this.#hexagonPointSelector.setDisabled(true);
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
    // 3-2. 출발, 도착점을 클릭해서 직선에 걸쳐있는 h3Index를 넣고 빼는 line selector
    this.#hexagonLineSelector = hexagonLineSelector.createHexagonLineSelector({ meta });
    // 3-3. 폴리곤을 지도에 직접 그려서 영역에 걸쳐있는 h3Index를 넣고 빼는 polygon selector
    this.#hexagonPolygonSelector = hexagonPolygonSelector.createHexagonPolygonSelector({ meta });
    this.disableAllSelector();
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
    const paths = mapUtils.getPathsFromH3Indexes(this.#h3Indexes);
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
  disableAllSelector() {
    this.#hexagonPointSelector.setDisabled(true);
    this.#hexagonLineSelector.setDisabled(true);
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
  updateBannerPolyline() {
    this.#banner.setBannerText('지도 위에 직선을 그려서 Hexagon을 선택해주세요.');
    this.#banner.setVisibleBtnAdd(true);
    this.#banner.setVisibleBtnSubtract(true);
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
    this.#banner.setBannerText('Hexagon을 선택할 방식(점, 직선, 폴리곤)을 선택해주세요.');
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
    this.#hexagonLineSelector.setNaverMap(this.#map);
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
    if (this.#hexagonLineSelector) {
      this.#hexagonLineSelector.remove();
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

    if (this.#hexagonLineSelector) {
      this.#hexagonLineSelector.destroy();
    }
    this.#hexagonLineSelector = null;

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
