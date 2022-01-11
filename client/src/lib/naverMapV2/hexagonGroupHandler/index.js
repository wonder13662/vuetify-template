import hexagonCalculator from '../lib/hexagonCalculator';
import {
  DEFAULT_ZOOM,
  HEXAGON_MODE,
  HEXAGON_MODE_SET,
  HEXAGON_STATUS,
  HEXAGON_STATUS_SET,
  HEXAGON_EVENT,
  HEXAGON_EVENT_SET,
} from '../lib/constants';
import hexagonHandler from './hexagonHandler';
import naverMapWrapper from '../lib/naverMapWrapper';

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

const addHexagon = ({ h3Index, h3Indexes, hexagonMap }) => {
  // (내부의 빈공간의 폴리곤을 저장하는 구조로 바뀌면 아래 조건들은 제거 되어야 함)
  // 1. 이미 선택되었지만, HexagonGroup의 내부(자신을 다른 Hexagon들 6개가 둘러싼 경우)라면 제거하지 않는다.
  if (hexagonCalculator.isSurrounded(h3Index, h3Indexes)) {
    return;
  }
  // 2. 다른 Hexagon에 둘러싸여 닫히지 않았고, 이미 선택된 Hexagon이라면 제거
  // 3. TODO 제거한 뒤에, 따로 떨어져 있는 폴리곤들도 함께 제거(이건 조건이 좀 복잡하다)
  // ex) 길게 늘어진 선 형태의 폴리곤(두께: 폴리곤 1개)에서 가운데 폴리곤을 제거하면 어느 쪽이 남아야 하는가?
  hexagonMap.delete(h3Index);
};

const subtractHexagon = ({ h3Index, hexagonMap }) => {
  // 1. 없는 Hexagon이라면 추가
  // 2. 이미 선택된 Hexagon과 붙어있지 않다면 저장 불가
  // (2개 이상의 떨어져 있는 폴리곤을 저장하는 구조로 바뀌면 이 조건은 제거 되어야 함)
  // 3. h3Index로 hexagon 객체를 새로 만든다
  const hexagon = createHexagon(hexagonMap, h3Index);
  // 4. 새로 만든 hexagon 객체를 hexagonGroups에 추가한다.
  setHexagonToHexagonMap(hexagonMap, hexagon);
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

  #eventListenerMap

  #onFocus

  #onBlur

  #onClick

  #onDisabled

  #onUnselected

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
    onUnselected = () => {},
    onChange = () => {},
    isEditable = false,
  }) {
    this.#hexagonGroupName = hexagonGroupName;
    this.#hexagonMap = createHexagonMap(new Map(), h3Indexes);
    this.#meta = meta;
    this.#mode = HEXAGON_MODE.READ_UNSELECTED;
    this.#zoomLevel = DEFAULT_ZOOM;
    this.#hexagonGroupPolygon = null;
    this.#hexagonGroupPolygonListeners = null;
    this.#stylePolygonBorderFocus = null;
    this.#stylePolygonBorderBlur = null;
    this.#status = HEXAGON_STATUS.BLUR;
    this.#eventListenerMap = new Map();
    this.#eventListenerMap.set(HEXAGON_EVENT.BLUR, new Map());
    this.#eventListenerMap.set(HEXAGON_EVENT.FOCUS, new Map());
    this.#eventListenerMap.set(HEXAGON_EVENT.CLICK, new Map());
    this.#onFocus = onFocus;
    this.#onBlur = onBlur;
    this.#onClick = onClick;
    this.#onDisabled = onDisabled;
    this.#onUnselected = onUnselected;
    this.#onChange = onChange;
    this.#isEditable = isEditable;
  }

  /**
   * HexagonGroup의 모드 상태를 바꿉니다.
   *
   * @return {void} 없음
   */
  setMode(mode) {
    if (!HEXAGON_MODE_SET.has(mode)) {
      throw new Error('mode: 유효하지 않습니다.');
    }
    this.#mode = mode;
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

  /**
   * HexagonGroup의 bound를 가져옵니다.
   *
   * @return {object} Naver bound 객체
   */
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
    if (this.mode !== HEXAGON_MODE.EDIT) {
      return;
    }
    // 1. point에 해당하는 h3Index를 구한다
    const h3Index = hexagonCalculator.convertPointToH3Index(point);
    const hasNoH3Index = this.h3Indexes.length === 0;
    const hasNeighborH3Index = hexagonCalculator.isNeighbor(h3Index, this.h3Indexes);
    const hasH3Index = this.#hexagonMap.has(h3Index);
    if (hasH3Index) {
      addHexagon({
        h3Index,
        h3Indexes: this.h3Indexes,
        hexagonMap: this.#hexagonMap,
      });
    } else if (hasNoH3Index || hasNeighborH3Index) {
      subtractHexagon({
        h3Index,
        hexagonMap: this.#hexagonMap,
      });
    }
    // 4. 새로 만든 hexagon 객체를 지도 위에 polygon으로 그린다.
    this.draw(map);
    // 5. Hexagon 갯수가 변했으므로 콜백으로 알린다.
    if (this.#onChange) {
      this.#onChange(this);
    }
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseover 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.#stylePolygonBorderBlur
   */
  getStylePolygonBorderFocus() {
    switch (this.#mode) {
      case HEXAGON_MODE.READ_UNSELECTED:
        return hexagonCalculator.getStyleReadUnselectedFocus();
      case HEXAGON_MODE.READ_SELECTED:
        return hexagonCalculator.getStyleReadSelectedFocus();
      case HEXAGON_MODE.DISABLED:
        return hexagonCalculator.getStyleDisabledFocus();
      case HEXAGON_MODE.EDIT:
        return hexagonCalculator.getStyleEditFocus();
      default:
        return this.#stylePolygonBorderFocus;
    }
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseout 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.#stylePolygonBorderBlur
   */
  getStylePolygonBorderBlur() {
    switch (this.#mode) {
      case HEXAGON_MODE.READ_UNSELECTED:
        return hexagonCalculator.getStyleReadUnselectedBlur();
      case HEXAGON_MODE.READ_SELECTED:
        return hexagonCalculator.getStyleReadSelectedBlur();
      case HEXAGON_MODE.DISABLED:
        return hexagonCalculator.getStyleDisabledBlur();
      case HEXAGON_MODE.EDIT:
        return hexagonCalculator.getStyleEditBlur();
      default:
        return this.#stylePolygonBorderBlur;
    }
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

  addEventListener({ event, listener, id }) {
    if (!HEXAGON_EVENT_SET.has(event)) {
      throw new Error(`event:${event} / 유효하지 않습니다.`);
    }
    if (!listener) {
      throw new Error(`listener:${listener} / 유효하지 않습니다.`);
    }
    if (!id) {
      throw new Error(`id:${id} / 유효하지 않습니다.`);
    }
    this.#eventListenerMap.get(event).set(id, listener);
  }

  removeEventListener({ event, id }) {
    if (!HEXAGON_EVENT_SET.has(event)) {
      throw new Error(`event:${event} / 유효하지 않습니다.`);
    }
    if (!id) {
      throw new Error(`id:${id} / 유효하지 않습니다.`);
    }
    if (this.#eventListenerMap.get(event).has(id)) {
      this.#eventListenerMap.get(event).delete(id);
    }
  }

  /**
   * Hexagon의 상태를 설정합니다. 아래 값 중 하나여야 합니다.
   * 1. HEXAGON_STATUS.BLUR
   * 2. HEXAGON_STATUS.FOCUS
   *
   * @param {string} arg (required) Hexagon의 상태
   *
   * @return {void} 없음
   */
  setStatus(arg) { // TODO set status로 바꿔야 함
    if (!HEXAGON_STATUS_SET.has(arg)) {
      throw new Error(`arg:${arg}: 유효하지 않습니다.`);
    }
    this.#status = arg;
  }

  get status() {
    return this.#status;
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
          this.setClickedPoint({
            map: v.map,
            point: v.point,
          });
          this.click();
        },
      });
      this.#hexagonGroupPolygon = polygon;
      this.#hexagonGroupPolygonListeners = listeners;
    }
  }

  /**
   * 지도 위에 Hexagon을 Focus시킵니다.
   *
   * @param {object} meta (optional)호출자가 Focus 시의 맥락 정보를 담은 meta 객체
   *
   * @return {void} 없음
   */
  focus(meta = {}) {
    this.#status = HEXAGON_STATUS.FOCUS;

    if (this.#hexagonGroupPolygon) {
      this.#hexagonGroupPolygon.setStyles(this.getStylePolygonBorderFocus());
    }
    if (this.#onFocus) {
      this.#onFocus(this);
    }
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.FOCUS);
    if (eventListenerMap.size > 0) {
      Array.from(eventListenerMap.values()).forEach((v) => v({
        hexagonGroup: this,
        meta,
      }));
    }
  }

  /**
   * 지도 위에 Hexagon을 Blur시킵니다.
   *
   * @param {object} meta (optional)호출자가 Blur 시의 맥락 정보를 담은 meta 객체
   *
   * @return {void} 없음
   */
  blur(meta = {}) {
    this.#status = HEXAGON_STATUS.BLUR;

    if (this.#hexagonGroupPolygon) {
      this.#hexagonGroupPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
    if (this.#onBlur) {
      this.#onBlur(this);
    }
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.BLUR);
    if (eventListenerMap.size > 0) {
      Array.from(eventListenerMap.values()).forEach((v) => v({
        hexagonGroup: this,
        meta,
      }));
    }
  }

  /**
   * 지도 위에 Hexagon을 Click 합니다.
   *
   * @param {object} meta (optional)호출자가 Click 시의 맥락 정보를 담은 meta 객체
   *
   * @return {void} 없음
   */
  click(meta = {}) {
    if (this.#onClick) {
      this.#onClick(this);
    }
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.CLICK);
    if (eventListenerMap.size > 0) {
      Array.from(eventListenerMap.values()).forEach((v) => v({
        hexagonGroup: this,
        meta,
      }));
    }
  }

  /**
   * 지도 위에 Hexagon을 Disabled 합니다.
   *
   * @return {void} 없음
   */
  disabled() {
    this.#status = HEXAGON_STATUS.BLUR;

    if (this.#hexagonGroupPolygon) {
      this.#hexagonGroupPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
    if (this.#onDisabled) {
      this.#onDisabled(this);
    }
  }

  /**
   * 지도 위에 Hexagon의 Mode를 Unselected로 바꿉니다.
   *
   * @return {void} 없음
   */
  unselected() {
    this.#status = HEXAGON_STATUS.BLUR;

    if (this.#hexagonGroupPolygon) {
      this.#hexagonGroupPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
    if (this.#onUnselected) {
      this.#onUnselected(this);
    }
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
  }

  /**
   * Hexagon 객체를 없앱니다.
   *
   * @return {void} 없음
   */
  destroy() {
    this.remove();
    this.#onFocus = null;
    this.#onBlur = null;
    this.#onClick = null;
    this.#onDisabled = null;
    this.#onUnselected = null;
    this.#onChange = null;
  }
}

export default {
  // 1. create
  createHexagonGroup({
    hexagonGroupName,
    h3Indexes = [],
    meta = {},
    onFocus = () => {}, // REMOVE ME 콜백 제거 필요
    onBlur = () => {}, // REMOVE ME 콜백 제거 필요
    onClick = () => {}, // REMOVE ME 콜백 제거 필요
    onDisabled = () => {}, // REMOVE ME 콜백 제거 필요
    onUnselected = () => {}, // REMOVE ME 콜백 제거 필요
    onChange = () => {}, // REMOVE ME 콜백 제거 필요
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
      onUnselected,
      onChange,
      isEditable,
    });
  },
  // 2. read
  // 2-1. bound
  getBound(hexagonGroups) {
    const bounds = hexagonGroups.map((v) => v.getBound());
    const mergedBound = bounds.reduce((acc, v) => {
      if (!acc) return v;
      return acc.merge(v);
    }, null);
    return mergedBound;
  },
  // 3. update
  // 3-1. hexagonGroups에 새로운 hexagonGroup을 추가합니다.
  addHexagonGroup({
    hexagonGroups,
  }) {
    const hg = this.createHexagonGroup({
      hexagonGroupName: '',
      isEditable: true,
    });
    hexagonGroups.push(hg);
  },
  // 3-2. draw
  drawHexagonGroups({
    map,
    hexagonGroups,
  }) {
    hexagonGroups.forEach((v) => v.draw(map));
  },
  // 3-3. remove(draw한 것을 지도 위에서 지웁니다)
  removeHexagonGroups(hexagonGroups) {
    hexagonGroups.forEach((v) => v.remove());
  },
  // 3-4. setZoomLevel
  setZoomLevel({
    map,
    hexagonGroups,
    zoomLevel,
  }) {
    hexagonGroups.forEach((v) => {
      if (this.mode !== HEXAGON_MODE.EDIT) {
        v.setZoomLevel({ map, zoomLevel });
      }
    });
  },
  // 3-5. onClick
  setClickedPoint({
    map,
    hexagonGroups,
    point,
  }) {
    hexagonGroups.forEach((v) => {
      if (this.mode !== HEXAGON_MODE.EDIT) {
        v.setClickedPoint({ map, point });
      }
    });
  },
  setStatusBlur(hexagonGroups) {
    if (hexagonGroups && hexagonGroups.length > 0) {
      hexagonGroups.forEach((v) => v.blur());
    }
  },
  setModeDisabled(hexagonGroups) {
    if (hexagonGroups && hexagonGroups.length > 0) {
      hexagonGroups.forEach((v) => v.disabled());
    }
  },
  setModeUnselected(hexagonGroups) {
    if (hexagonGroups && hexagonGroups.length > 0) {
      hexagonGroups.forEach((v) => v.unselected());
    }
  },
  // 4. delete
  // 4-1. destroy(hexagonGroup을 메모리에서 삭제합니다. remove 작업도 함께 수행합니다.)
  destroyHexagonGroups(hexagonGroups) {
    hexagonGroups.forEach((v) => v.destroy());
  },
};
