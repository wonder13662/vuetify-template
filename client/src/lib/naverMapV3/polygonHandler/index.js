import naverMapWrapper from '../lib/naverMapWrapper';
import overlayEventHandler from '../lib/overlayEventHandler';
import hexagonCalculator from '../lib/hexagonCalculator';
import boundHandler from '../lib/boundHandler';
import {
  Z_INDEX_POLYGON_BORDER,
} from '../lib/constants';

// TODO HexagonGroupHandler와 HexagonHandler가 이 객체를 사용하도록 변경해야 합니다.

const STYLE_MAP = {
  // Vuetify의 deep-purple 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  DEEP_PURPLE: {
    fillColor: '#7E57C2',
    strokeColor: '#5E35B1',
  },
  // Vuetify의 purple 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  PURPLE: {
    fillColor: '#9C27B0',
    strokeColor: '#4A148C',
  },
  // Vuetify의 Orange 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  ORANGE: {
    fillColor: '#FF9800', // orange
    strokeColor: '#E65100', // orange darken-4
  },
  // Vuetify의 Yellow 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  YELLOW: {
    fillColor: '#FFEB3B', // yellow
    strokeColor: '#F57F17', // yellow darken-4
  },
  // Vuetify의 lime 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  LIME: {
    fillColor: '#CDDC39', // lime
    strokeColor: '#827717', // lime darken-4
  },
  // Vuetify의 lime 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  GREY: {
    fillColor: '#757575', // grey darken-1
    strokeColor: '#616161', // grey darken-2
  },
  // Vuetify의 light-green 사용
  // https://vuetifyjs.com/en/styles/colors/#material-colors
  LIGHT_GREEN: {
    fillColor: '#64DD17', // light-green accent-4
    strokeColor: '#33691E', // light-green darken-4
  },
  COMMON: {
    strokeWeight: 2,
    zIndex: Z_INDEX_POLYGON_BORDER,
  },
  FOCUS: {
    fillOpacity: 0.6,
  },
  BLUR: {
    fillOpacity: 0.4,
  },
};

const MODE = {
  EDIT: 'EDIT',
  SELECTED: 'SELECTED',
  UNSELECTED: 'UNSELECTED',
  DISABLED: 'DISABLED',
};

/**
 * Naver map의 폴리곤 경계의 스타일 값을 줍니다.
 * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Data.html#toc25__anchor
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
const getStyleUnselectedBlur = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.DEEP_PURPLE,
  ...STYLE_MAP.BLUR,
});

/**
 * Naver map의 폴리곤 경계의 Focus 시의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleUnselectedFocus = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.PURPLE,
  ...STYLE_MAP.FOCUS,
});

/**
 * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Blur의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleSelectedBlur = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.ORANGE,
  ...STYLE_MAP.BLUR,
});

/**
 * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Focus의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleSelectedFocus = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.YELLOW,
  ...STYLE_MAP.FOCUS,
});

/**
 * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Blur의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleDisabledBlur = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.GREY,
  ...STYLE_MAP.BLUR,
});

/**
 * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Focus의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleDisabledFocus = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.GREY,
  ...STYLE_MAP.FOCUS,
});

/**
 * Naver map의 폴리곤 경계가 편집중일 때의 Blur의 스타일 값을 줍니다.
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleEditBlur = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.LIGHT_GREEN,
  ...STYLE_MAP.BLUR,
});

/**
 * Naver map의 폴리곤 경계가 편집중일 때의 Focus의 스타일 값을 줍니다.
 * Vuetify의 light-green 사용
 * https://vuetifyjs.com/en/styles/colors/#material-colors
 * fillColor: light-green accent-4 #64DD17
 * stokeColor: light-green darken-4 #33691E
 *
 * @return {object} Naver 맵의 폴리곤 경계의 스타일
 */
// eslint-disable-next-line no-unused-vars
const getStyleEditFocus = () => ({
  ...STYLE_MAP.COMMON,
  ...STYLE_MAP.LIGHT_GREEN,
  ...STYLE_MAP.FOCUS,
});

class Polygon {
  #paths

  #clickable

  #visible

  #meta

  #naverPolygon

  #overlayEventController

  #mode

  #map

  #modeChangeEventListener

  /**
   * 좌표를 받아 Naver 폴리곤을 제어(그리기,지우기)하는 Polygon 객체를 만듭니다.
   *
   * @param {array<ArrayOfCoordsLiteral>} paths - (required)위도(lat), 경도(lng) 속성을 가지는 Point 객체
   * @param {boolean} clickable - (optional)Naver polygon 객체가 mouseevent를 받을 수 있는지 여부
   * @param {function} onFocus - (optional)Naver polygon 객체에 mouseenter 이벤트시 호출되는 콜백
   * @param {function} onBlur - (optional)Naver polygon 객체에 mouseleave 이벤트시 호출되는 콜백
   * @param {function} onClick - (optional)Naver polygon 객체에 click 이벤트시 호출되는 콜백
   * @param {function} onMousemove - (optional)Naver polygon 객체에 mousemove 이벤트시 호출되는 콜백
   * @param {object} meta - (optional)마커의 메타정보
   *
   * @return {Polygon} Polygon의 인스턴스
   */
  constructor({
    paths = [],
    clickable = true,
    onFocus = () => ({}),
    onBlur = () => ({}),
    onClick = () => ({}),
    onMousemove = () => ({}),
    meta = {},
  }) {
    this.#paths = paths;
    this.#clickable = clickable;
    this.#visible = true;
    this.#meta = { ...meta };
    this.#map = null;
    this.#mode = MODE.UNSELECTED;
    this.#naverPolygon = null;
    this.#overlayEventController = overlayEventHandler.createOverlayEventController({
      onFocus,
      onBlur,
      onClick,
      onMousemove,
      meta: { ...this.#meta },
    });
    this.#modeChangeEventListener = [];
  }

  /**
   * 사용자가 입력한 meta 객체의 복사본을 돌려줍니다.
   *
   * @return {object} 사용자 meta 객체
   */
  get meta() {
    return {
      ...this.#meta,
    };
  }

  /**
   * 주의: 이 메서드는 외부에서 호출하면 안됩니다.
   * Polygon의 mode에 따라 Naver Polygon에 Blur 스타일을 적용합니다.
   *
   * @return {void} 리턴값 없음
   */
  updatePolygonStyleBlur() {
    switch (this.#mode) {
      case MODE.DISABLED:
        this.#naverPolygon.setOptions({
          ...getStyleDisabledBlur(),
        });
        break;
      case MODE.EDIT:
        this.#naverPolygon.setOptions({
          ...getStyleEditBlur(),
        });
        break;
      case MODE.SELECTED:
        this.#naverPolygon.setOptions({
          ...getStyleSelectedBlur(),
        });
        break;
      case MODE.UNSELECTED:
        this.#naverPolygon.setOptions({
          ...getStyleUnselectedBlur(),
        });
        break;
      default:
        throw new Error(`Polygon/updatePolygonStyleBlur/this.#mode:${this.#mode}/유효하지 않습니다.`);
    }
  }

  /**
   * 주의: 이 메서드는 외부에서 호출하면 안됩니다.
   * Polygon의 mode에 따라 Naver Polygon에 Blur 스타일을 적용합니다.
   *
   * @return {void} 리턴값 없음
   */
  updatePolygonStyleFocus() {
    switch (this.#mode) {
      case MODE.DISABLED:
        this.#naverPolygon.setOptions({
          ...getStyleDisabledFocus(),
        });
        break;
      case MODE.EDIT:
        this.#naverPolygon.setOptions({
          ...getStyleEditFocus(),
        });
        break;
      case MODE.SELECTED:
        this.#naverPolygon.setOptions({
          ...getStyleSelectedFocus(),
        });
        break;
      case MODE.UNSELECTED:
        this.#naverPolygon.setOptions({
          ...getStyleUnselectedFocus(),
        });
        break;
      default:
        throw new Error(`Polygon/updatePolygonStyleFocus/this.#mode:${this.#mode}/유효하지 않습니다.`);
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
      throw new Error(`Polygon/setNaverMap/map:${map}/유효하지 않음`);
    }
    // 네이버 맵이 설정되지 않은 경우, 1번만 호출해야 합니다.
    if (this.#map) {
      return;
    }

    this.#map = map;
    // 네이버 폴리곤 객체를 지도 위에 그립니다.
    this.#naverPolygon = naverMapWrapper.drawPolygonNoListener({
      map,
      naverPolygonPaths: this.#paths,
      clickable: this.#clickable,
      style: getStyleUnselectedBlur(),
      visible: this.#visible,
    });
    this.updatePolygonStyleBlur();
    this.#overlayEventController.setOverlay(this.#naverPolygon);
  }

  /**
   * 네이버 폴리곤을 네이버 지도 객체 위에 그립니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html
   *
   * @deprecated setNaverMap을 대신 사용해주세요.
   *
   * @param {object} map - (required) 네이버 맵 인스턴스
   *
   * @return {void} 반환값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error(`Polygon/draw/map:${map}/유효하지 않음`);
    }
    // eslint-disable-next-line no-console
    console.warn('Polygon/draw/deprecated/setNaverMap을 대신 사용해주세요.');
    this.setNaverMap(map);
  }

  /**
   * 네이버 폴리곤을 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#naverPolygon) {
      this.#naverPolygon.setMap(null);
      this.#naverPolygon = null;
    }
    this.#modeChangeEventListener = [];
  }

  /**
   * Polygon 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#overlayEventController) {
      this.#overlayEventController.remove();
      this.#overlayEventController = null;
    }
  }

  /**
   * Point들의 배열을 인자로 Polygon 객체의 Path를 설정합니다.
   * 이 경우에는 오직 1개의 닫힌 다각형만 그리게 됩니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setPath__anchor
   *
   * @param {array} points - Point 객체의 배열
   *
   * @return {void} 리턴값 없음
   */
  setPathByPoints(points) {
    if (!this.#naverPolygon) {
      return;
    }

    if (points.length === 0) {
      // 빈 배열을 넘기면 마지막으로 그렸던 도형이 그대로 노출됨
      // 우회방법으로 지도에서 표시하지 않는 것으로 설정
      this.#naverPolygon.setVisible(false);
      return;
    }
    if (!this.#naverPolygon.getVisible()) {
      this.#naverPolygon.setVisible(true);
    }

    this.#paths = [
      points,
    ];

    if (!this.#naverPolygon) {
      this.#naverPolygon = naverMapWrapper.drawPolygonNoListener({
        map: this.#map,
        naverPolygonPaths: this.#paths,
        clickable: this.#clickable,
        style: getStyleUnselectedBlur(),
      });
    } else {
      this.#naverPolygon.setPaths(this.#paths);
    }
  }

  /**
   * Polygon 객체의 Path를 여러개 설정합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setPath__anchor
   *
   * @param {array} pointListList - Point 객체의 배열의 배열
   *
   * @return {void} 리턴값 없음
   */
  setPaths(paths) {
    if (!this.#naverPolygon) {
      return;
    }
    // TODO paths 검증
    if (paths.length === 0) {
      // 빈 배열을 넘기면 마지막으로 그렸던 도형이 그대로 노출됨
      // 우회방법으로 지도에서 표시하지 않는 것으로 설정
      this.#naverPolygon.setVisible(false);
      return;
    }
    if (!this.#naverPolygon.getVisible()) {
      this.#naverPolygon.setVisible(true);
    }
    this.#paths = paths;
    this.#naverPolygon.setPaths(paths);
  }

  /**
   * h3Index의 배열을 인자로 Polygon 객체의 Path를 여러개 설정합니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setPath__anchor
   *
   * @param {array<String>} h3Indexes 문자열 h3Index 배열
   *
   * @return {void} 리턴값 없음
   */
  setPathsByH3Indexes(h3Indexes) {
    const paths = hexagonCalculator.getPathsFromH3Indexes(h3Indexes);
    this.setPaths(paths);
  }

  /**
   * Naver Polygon에 focus 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - focus 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addFocusListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    const id = this.#overlayEventController.addFocusListener(listener);
    return id;
  }

  /**
   * Naver Polygon에 focus 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeFocusListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    this.#overlayEventController.removeFocusListener(id);
  }

  /**
   * Naver Polygon에 blur 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - blur 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addBlurListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    const id = this.#overlayEventController.addBlurListener(listener);
    return id;
  }

  /**
   * Naver Polygon에 blur 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeBlurListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    this.#overlayEventController.removeBlurListener(id);
  }

  /**
   * Naver Polygon에 click 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    const id = this.#overlayEventController.addClickListener(listener);
    return id;
  }

  /**
   * Naver Polygon에 click 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeClickListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    this.#overlayEventController.removeClickListener(id);
  }

  /**
   * Naver Polygon에 mousemove 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - mousemove 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addMousemoveListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    const id = this.#overlayEventController.addMousemoveListener(listener);
    return id;
  }

  /**
   * Naver Polygon에 mousemove 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeMousemoveListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#overlayEventController) {
      throw new Error('this.#overlayEventController/유효하지 않습니다.');
    }

    this.#overlayEventController.removeMousemoveListener(id);
  }

  /**
   * Polygon의 Mode가 변경된 이벤트를 감시하는 리스너를 추가합니다.
   *
   * @param {function} listener - mode change 이벤트 리스너
   *
   * @return {void} 리턴값 없음
   */
  addModeChangeListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }

    this.#modeChangeEventListener.push(listener);
  }

  /**
   * polygon의 모드를 미선택(UNSELECTED) 모드로 바꿉니다.
   *
   * @return {void} 리턴값 없음
   */
  setModeUnselected() {
    this.#mode = MODE.UNSELECTED;
    if (this.#naverPolygon) {
      this.#naverPolygon.setOptions(getStyleUnselectedBlur());
    }
    this.#modeChangeEventListener.forEach((listener) => listener());
  }

  /**
   * polygon의 모드를 선택(SELECTED) 모드로 바꿉니다.
   *
   * @return {void} 리턴값 없음
   */
  setModeSelected() {
    this.#mode = MODE.SELECTED;
    if (this.#naverPolygon) {
      this.#naverPolygon.setOptions(getStyleSelectedBlur());
    }
    this.#modeChangeEventListener.forEach((listener) => listener());
  }

  /**
   * polygon의 모드를 수정(EDIT) 모드로 바꿉니다.
   *
   * @return {void} 리턴값 없음
   */
  setModeEdit() {
    this.#mode = MODE.EDIT;
    if (this.#naverPolygon) {
      this.#naverPolygon.setOptions(getStyleEditBlur());
    }
    this.#modeChangeEventListener.forEach((listener) => listener());
  }

  /**
   * 전체 기능의 비활성화 여부를 설정합니다.
   *
   * @param {boolean} disabled - 전체 기능의 비활성화 여부
   *
   * @return {void} 리턴값 없음
   */
  setDisabled(disabled) {
    this.#overlayEventController.setDisabled(disabled);

    if (disabled) {
      this.#mode = MODE.DISABLED;
      if (this.#naverPolygon) {
        this.#naverPolygon.setOptions({
          ...getStyleDisabledBlur(),
          clickable: false,
        });
      }
      this.#modeChangeEventListener.forEach((listener) => listener());
      return;
    }
    this.#mode = MODE.UNSELECTED;
    if (this.#naverPolygon) {
      this.#naverPolygon.setOptions({
        ...getStyleUnselectedBlur(),
        clickable: true,
      });
    }
    this.#modeChangeEventListener.forEach((listener) => listener());
  }

  /**
   * 전체 기능의 비활성화 여부를 가져옵니다.
   *
   * @deprecated isDisabled를 대신 사용해주세요.
   *
   * @return {boolean} 전체 기능의 비활성화 여부
   */
  getDisabled() {
    return this.isDisabled();
  }

  /**
   * 전체 기능의 비활성화 여부를 가져옵니다.
   *
   * @return {boolean} 전체 기능의 비활성화 여부
   */
  isDisabled() {
    return this.#mode === MODE.DISABLED;
  }

  /**
   * Polygon이 선택되었는지 여부를 알려줍니다.
   *
   * @return {boolean} Polygon이 선택되었는지 여부
   */
  isSelected() {
    return this.#mode === MODE.SELECTED;
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
    if (this.#naverPolygon) {
      this.#naverPolygon.setVisible(this.#visible);
    }
  }

  /**
   * 지도 위의 노출 여부를 가져옵니다.
   *
   * @return {boolean} visible - 지도 위의 노출 여부
   */
  getVisible() {
    return this.#visible;
  }

  /**
   * polygon의 paths를 가져와 Bound 객체를 돌려줍니다.
   *
   * @return {Bound} bounds - polygon의 Bounds
   */
  getBounds() {
    // 1. this.#naverPolygon에서 직접 bounds 가져오기
    if (this.#naverPolygon) {
      const naverBounds = this.#naverPolygon.getBounds();
      const ne = naverBounds.getNE();
      const nePoint = {
        lat: ne.lat(),
        lng: ne.lng(),
      };
      const sw = naverBounds.getSW();
      const swPoint = {
        lat: sw.lat(),
        lng: sw.lng(),
      };

      return boundHandler.createBoundsBy2Points(nePoint, swPoint);
    }

    // 2. this.#paths에서 bounds 가져오기
    if (this.#paths) {
      const points = this.#paths.flat();
      return boundHandler.createBoundsByPoints(points);
    }

    return null;
  }

  /**
   * polygon에 사용자 이벤트가 아닌 프로그래밍적으로 강제로 focus 이벤트를 발생시킵니다.
   *
   * @return {void} 반환값 없음
   */
  focus() {
    this.updatePolygonStyleFocus();
  }

  /**
   * polygon에 사용자 이벤트가 아닌 프로그래밍적으로 강제로 blur 이벤트를 발생시킵니다.
   *
   * @return {void} 반환값 없음
   */
  blur() {
    this.updatePolygonStyleBlur();
  }
}

export default {
  createPolygon({
    paths = [],
    clickable = true,
    onFocus = () => ({}),
    onBlur = () => ({}),
    onClick = () => ({}),
    onMousemove = () => ({}),
    meta = {},
  }) {
    return new Polygon({
      paths,
      clickable,
      onFocus,
      onBlur,
      onClick,
      onMousemove,
      meta,
    });
  },
};
