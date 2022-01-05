import hexagonCalculator from '../lib/hexagonCalculator';
import {
  DEFAULT_ZOOM,
  HEXAGON_STATUS,
  HEXAGON_STATUS_SET,
} from '../lib/constants';
import hexagonHandler from './hexagonHandler';
import naverMapWrapper from '../lib/naverMapWrapper';

const MODE_READ_ONLY = 'MODE_READ_ONLY';
const MODE_EDIT = 'MODE_EDIT';

// TODO 멤버 변수의 private 선언 필요

const drawPolygon = ({
  map,
  h3Indexes,
  style,
  onFocus = () => {},
  onBlur = () => {},
  onClick = () => {},
}) => {
  // eslint-disable-next-line max-len
  const naverPolygonPaths = hexagonCalculator.convertH3IndexesToNaverPolygonPathOutline(h3Indexes);
  const { polygon, listeners } = naverMapWrapper.drawPolygon({
    map,
    naverPolygonPaths,
    style,
    onMouseover: onFocus,
    onMouseout: onBlur,
    onClick: (v) => {
      const {
        coord: {
          _lat: lat,
          _lng: lng,
        },
      } = v;
      const point = {
        lat,
        lng,
      };
      onClick({
        point,
        map,
      });
      return {
        point,
        map,
      };
    },
  });

  return {
    polygon,
    listeners,
  };
};

const createHexagon = (hexagonMap, h3Index) => hexagonHandler.createHexagon({
  h3Index,
  onRemove: (h3IndexToRemove) => {
    if (!hexagonMap.has(h3IndexToRemove)) {
      return;
    }
    // 1-1. hexagon을 네이버 맵에서 제거
    hexagonMap.get(h3IndexToRemove).remove();
    // 1-2. hexagon을 hexagonMap에서 제거
    hexagonMap.delete(h3IndexToRemove);
  },
});

const setHexagonToHexagonMap = (hexagonMap, hexagon) => {
  hexagonMap.set(hexagon.h3Index, hexagon);
};

const createHexagonMap = (hexagonMap, h3Indexes) => {
  h3Indexes.forEach((v) => {
    const hexagon = createHexagon(hexagonMap, v);
    setHexagonToHexagonMap(hexagonMap, hexagon);
  });
  return hexagonMap;
};


class HexagonGroup {
  #hexagonGroupName

  #hexagonMap

  #meta

  #mode

  #zoomLevel

  #hexagonGroupPolygon

  #hexagonGroupPolygonListeners

  #stylePolygonBorderFocus

  #stylePolygonBorderBlur

  #status

  #onFocus

  #onBlur

  #onClick

  #onDisabled

  #onEnabled

  #onChange

  #isEditable

  constructor({
    hexagonGroupName,
    h3Indexes = [],
    meta = {},
    onFocus = () => {},
    onBlur = () => {},
    onClick = () => {},
    onDisabled = () => {},
    onEnabled = () => {},
    onChange = () => {},
    isEditable = false,
  }) {
    this.#hexagonGroupName = hexagonGroupName;
    this.#hexagonMap = createHexagonMap(new Map(), h3Indexes);
    this.#meta = meta;
    this.#mode = MODE_READ_ONLY;
    this.#zoomLevel = DEFAULT_ZOOM;
    this.#hexagonGroupPolygon = null;
    this.#hexagonGroupPolygonListeners = null;
    this.#stylePolygonBorderFocus = null;
    this.#stylePolygonBorderBlur = null;
    this.#status = HEXAGON_STATUS.HEXAGON_UNSELECTED;
    this.#onFocus = onFocus;
    this.#onBlur = onBlur;
    this.#onClick = onClick;
    this.#onDisabled = onDisabled;
    this.#onEnabled = onEnabled;
    this.#onChange = onChange;
    this.#isEditable = isEditable;
  }

  /**
   * HexagonGroup의 모드 상태를 바꿉니다.
   *
   * @return {void} 없음
   */
  setMode(mode) {
    if (mode !== MODE_READ_ONLY && mode !== MODE_EDIT) {
      throw new Error('mode: 유효하지 않습니다.');
    }
    this.#mode = mode;
  }

  setModeReadOnly() {
    this.setMode(MODE_READ_ONLY);
  }

  setModeEdit() {
    this.setMode(MODE_EDIT);
  }

  /**
   * HexagonGroup의 모드 상태가 읽기 모드인지 여부를 알려줍니다.
   *
   * @return {boolean} 읽기 모드인지 여부
   */
  isReadOnlyMode() {
    return this.#mode === MODE_READ_ONLY;
  }

  /**
   * HexagonGroup의 모드 상태가 편집 모드인지 여부를 알려줍니다.
   *
   * @return {boolean} 편집 모드인지 여부
   */
  isEditMode() {
    return this.#mode === MODE_EDIT;
  }

  /**
   * HexagonGroup에서 가지고 있는 h3Index의 배열을 돌려줍니다.
   *
   * @return {void} 없음
   */
  get h3Indexes() {
    return [...this.#hexagonMap.keys()];
  }

  /**
   * Naver 맵의 줌 레벨을 설정합니다.
   *
   * @param {number} 변경된 줌 레벨
   *
   * @return {void} 없음
   */
  // eslint-disable-next-line no-unused-vars
  setZoomLevel({ map, zoomLevel }) { // REMOVE ME - 이제 줌 레벨이 크게 의미가 없다. 삭제.
    this.#zoomLevel = zoomLevel;
  }

  /**
   * HexagonGroup의 change 이벤트 핸들러를 설정합니다.
   *
   * @return {void} 없음
   */
  setOnChange(onChange) {
    this.#onChange = onChange;
  }


  getBound() {
    return hexagonCalculator.convertH3IndexToBound(this.h3Indexes);
  }

  /**
   * Naver 맵 위에서 클릭 이벤트가 발생하면, hexagonGroup이 편집 모드일 경우, hexagon을 추가해줍니다
   *
   * @param {object} map (required) naver map 인스턴스
   * @param {object} point (required) 지도 위에 클릭된 위치 좌표 정보
   *
   * @return {void} 없음
   */
  setClickedPoint({ map, point }) {
    if (!this.isEditMode()) {
      return;
    }
    // 1. point에 해당하는 h3Index를 구한다
    const h3Index = hexagonCalculator.convertPointToH3Index(point);
    if (this.#hexagonMap.has(h3Index)) {
      // 2-1. 이미 선택된 Hexagon이라면 제거
      this.#hexagonMap.delete(h3Index);
    } else {
      // 2-2. 없는 Hexagon이라면 추가
      // 2. h3Index로 hexagon 객체를 새로 만든다
      const hexagon = createHexagon(this.#hexagonMap, h3Index);
      // 3. 새로 만든 hexagon 객체를 hexagonGroups에 추가한다.
      setHexagonToHexagonMap(this.#hexagonMap, hexagon);
    }
    // 4. 새로 만든 hexagon 객체를 지도 위에 polygon으로 그린다.
    this.draw(map);
    // 5. Hexagon 갯수가 변했으므로 콜백으로 알린다.
    this.#onChange(this);
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseover 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.#stylePolygonBorderBlur
   */
  getStylePolygonBorderFocus() {
    if (!this.#stylePolygonBorderFocus) {
      return hexagonCalculator.getStylePolygonBorderFocus();
    }
    return this.#stylePolygonBorderFocus;
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseout 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.#stylePolygonBorderBlur
   */
  getStylePolygonBorderBlur() {
    if (this.#status === HEXAGON_STATUS.HEXAGON_UNSELECTED) {
      return hexagonCalculator.getStylePolygonBorder();
    }
    if (this.#status === HEXAGON_STATUS.HEXAGON_SELECTED) {
      return hexagonCalculator.getStylePolygonSelected();
    }
    if (this.#status === HEXAGON_STATUS.HEXAGON_DISABLED) {
      return hexagonCalculator.getStylePolygonDisabled();
    }
    if (this.#status === HEXAGON_STATUS.HEXAGON_EDITING) {
      return hexagonCalculator.getStylePolygonEditing();
    }
    return this.#stylePolygonBorderBlur;
  }

  /**
   * HexagonGroup 생성시에 사용자가 입력한 meta 객체의 복사본을 돌려줍니다.
   *
   * @return {object} 사용자 meta 객체
   */
  get meta() {
    return {
      ...this.#meta,
    };
  }

  /**
   * Hexagon의 상태를 설정합니다. 아래 값 중 하나여야 합니다.
   * 1. HEXAGON_STATUS.HEXAGON_UNSELECTED
   * 2. HEXAGON_STATUS.HEXAGON_SELECTED
   * 3. HEXAGON_STATUS.HEXAGON_DISABLED
   * 4. HEXAGON_STATUS.HEXAGON_EDITING
   *
   * @param {string} arg (required) Hexagon의 상태
   *
   * @return {void} 없음
   */
  setStatus(arg) {
    if (!HEXAGON_STATUS_SET.has(arg)) {
      throw new Error(`arg:${arg}: 유효하지 않습니다.`);
    }
    this.#status = arg;
  }

  /**
   * Hexagon의 상태를 HEXAGON_STATUS.HEXAGON_EDITING으로 설정합니다.
   *
   * @return {void} 없음
   */
  setStatusEditing() {
    this.setStatus(HEXAGON_STATUS.HEXAGON_EDITING);
  }

  /**
   * 지도 위에 Hexagon을 나타내는 polygon을 그립니다.
   *
   * @param {object} map (required)naver map 인스턴스
   *
   * @return {void} 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    // 1. 이전에 그린 것이 있다면 지운다.
    this.remove();
    // 2. 새로 지도 위에 그린다.
    if (this.h3Indexes && this.h3Indexes.length > 0) {
      const { polygon, listeners } = drawPolygon({
        map,
        h3Indexes: this.h3Indexes,
        style: this.getStylePolygonBorderBlur(),
        onFocus: () => {
          this.focus();
        },
        onBlur: () => {
          this.blur();
        },
        onClick: (v) => {
          this.#onClick(this);
          this.setClickedPoint({
            map: v.map,
            point: v.point,
          });
        },
      });
      this.#hexagonGroupPolygon = polygon;
      this.#hexagonGroupPolygonListeners = listeners;
    }
  }

  /**
   * 지도 위에 Hexagon을 Focus시킵니다.
   *
   * @return {void} 없음
   */
  focus() {
    if (this.#onFocus) {
      this.#onFocus(this);
    }
    if (!this.#hexagonGroupPolygon
      || this.#status === HEXAGON_STATUS.HEXAGON_DISABLED
      || this.#mode === MODE_EDIT
    ) {
      return;
    }
    const styles = this.getStylePolygonBorderFocus();
    this.#hexagonGroupPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 Blur시킵니다.
   *
   * @return {void} 없음
   */
  blur() {
    if (this.#onBlur) {
      this.#onBlur(this);
    }
    if (!this.#hexagonGroupPolygon
      || this.#status === HEXAGON_STATUS.HEXAGON_DISABLED
    ) {
      return;
    }
    const styles = this.getStylePolygonBorderBlur();
    this.#hexagonGroupPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 Disabled 합니다.
   *
   * @return {void} 없음
   */
  disabled() {
    this.#onDisabled(this);
    if (!this.#hexagonGroupPolygon) {
      return;
    }
    this.setStatus(HEXAGON_STATUS.HEXAGON_DISABLED);
    const styles = this.getStylePolygonBorderBlur();
    this.#hexagonGroupPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 Disabled 합니다.
   *
   * @return {void} 없음
   */
  enabled() {
    this.#onEnabled(this);
    if (!this.#hexagonGroupPolygon) {
      return;
    }
    this.setStatus(HEXAGON_STATUS.HEXAGON_UNSELECTED);
    const styles = this.getStylePolygonBorderBlur();
    this.#hexagonGroupPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 나타내는 모든 polygon을 지웁니다.
   *
   * @return {void} 없음
   */
  remove() {
    if (this.#hexagonGroupPolygon && this.#hexagonGroupPolygonListeners) {
      naverMapWrapper.removePolygon({
        polygon: this.#hexagonGroupPolygon,
        listeners: this.#hexagonGroupPolygonListeners,
      });
    }
    this.#hexagonGroupPolygon = null;
    this.#hexagonGroupPolygonListeners = null;
    this.#onFocus = null;
    this.#onBlur = null;
    this.#onClick = null;
    this.#onDisabled = null;
    this.#onEnabled = null;
    this.#onChange = null;
  }
}

export default {
  // 1. create
  createHexagonGroup({
    hexagonGroupName,
    h3Indexes = [],
    meta = {},
    onFocus = () => {},
    onBlur = () => {},
    onClick = () => {},
    onDisabled = () => {},
    onEnabled = () => {},
    onChange = () => {},
    isEditable = false,
  }) {
    return new HexagonGroup({
      hexagonGroupName,
      h3Indexes,
      meta,
      onFocus,
      onBlur,
      onClick,
      onDisabled,
      onEnabled,
      onChange,
      isEditable,
    });
  },
  // 2. update
  // 2-1. hexagonGroups에 새로운 hexagonGroup을 추가합니다.
  addHexagonGroup({
    hexagonGroups,
  }) {
    const hg = this.createHexagonGroup({
      hexagonGroupName: '',
      isEditable: true,
    });
    hexagonGroups.push(hg);
  },
  // 2-2. hexagonGroups의 mode를 모두 read only(읽기모드)로 바꿉니다.
  setModeReadOnly(hexagonGroups) {
    hexagonGroups.forEach((v) => v.setModeReadOnly());
    hexagonGroups.forEach((v) => v.blur());
  },
  // 2-1. draw
  drawHexagonGroups({
    map,
    hexagonGroups,
  }) {
    hexagonGroups.forEach((v) => v.draw(map));
  },
  // 2-2. remove
  removeHexagonGroups(hexagonGroups) {
    hexagonGroups.forEach((v) => v.remove());
  },
  // 2-3. setZoomLevel
  setZoomLevel({
    map,
    hexagonGroups,
    zoomLevel,
  }) {
    hexagonGroups.forEach((v) => {
      if (v.isEditMode()) {
        v.setZoomLevel({ map, zoomLevel });
      }
    });
  },
  // 2-4. onClick
  setClickedPoint({
    map,
    hexagonGroups,
    point,
  }) {
    hexagonGroups.forEach((v) => {
      if (v.isEditMode()) {
        v.setClickedPoint({ map, point });
      }
    });
  },
  blurHexagonGroups(hexagonGroups) {
    if (!hexagonGroups || hexagonGroups.length === 0) {
      return;
    }
    hexagonGroups.forEach((v) => v.blur());
  },
  disabledHexagonGroups(hexagonGroups) {
    if (!hexagonGroups || hexagonGroups.length === 0) {
      return;
    }
    hexagonGroups.forEach((v) => v.disabled());
  },
  enabledHexagonGroups(hexagonGroups) {
    if (!hexagonGroups || hexagonGroups.length === 0) {
      return;
    }
    hexagonGroups.forEach((v) => v.enabled());
  },
  // 3. read
  // 3-1. bound
  getBound(hexagonGroups) {
    const bounds = hexagonGroups.map((v) => v.getBound());
    const mergedBound = bounds.reduce((acc, v) => {
      if (!acc) return v;
      return acc.merge(v);
    }, null);
    return mergedBound;
  },
  // 4. delete
};
