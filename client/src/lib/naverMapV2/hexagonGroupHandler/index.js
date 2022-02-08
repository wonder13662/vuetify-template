import hexagonCalculator from '../lib/hexagonCalculator';
import {
  HEXAGON_MODE,
  HEXAGON_MODE_SET,
  HEXAGON_STATUS,
  HEXAGON_STATUS_SET,
  HEXAGON_EVENT,
  HEXAGON_EVENT_SET,
} from '../lib/constants';
import naverMapWrapper from '../lib/naverMapWrapper';
import naverMapUtils from '../lib/utils';
import utils from '@/lib/utils';

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

const createHexagonSet = (h3Indexes) => utils.convertListToSet(h3Indexes);


const notifyEventListeners = ({ eventListenerMap, hexagonGroup, meta }) => {
  if (eventListenerMap.size === 0) {
    return;
  }
  Array.from(eventListenerMap.values()).forEach((v) => v({
    hexagonGroup,
    meta,
  }));
};
// TODO focus, blur, click 이벤트를 overlayEventController로 바꿔야 함!
class HexagonGroup {
  #hexagonSet

  #meta

  #mode

  #naverMapsPolygon

  #naverMapsPolygonListeners

  #stylePolygonBorderFocus

  #stylePolygonBorderBlur

  #status

  #eventListenerMap

  constructor({
    h3Indexes = [],
    meta = {},
  }) {
    this.#hexagonSet = createHexagonSet(h3Indexes);
    this.#meta = meta;
    this.#mode = HEXAGON_MODE.READ_UNSELECTED;
    this.#naverMapsPolygon = null;
    this.#naverMapsPolygonListeners = null;
    this.#stylePolygonBorderFocus = null;
    this.#stylePolygonBorderBlur = null;
    this.#status = HEXAGON_STATUS.BLUR;
    this.#eventListenerMap = new Map();
    this.#eventListenerMap.set(HEXAGON_EVENT.BLUR, new Map());
    this.#eventListenerMap.set(HEXAGON_EVENT.FOCUS, new Map());
    this.#eventListenerMap.set(HEXAGON_EVENT.CLICK, new Map());
    this.#eventListenerMap.set(HEXAGON_EVENT.CHANGE, new Map());
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
    if (!this.#hexagonSet || this.#hexagonSet.size === 0) {
      return [];
    }
    return utils.convertSetToList(this.#hexagonSet);
  }

  /**
   * HexagonGroup의 bound를 가져옵니다.
   *
   * @return {object} Naver bound 객체
   */
  getBound() {
    if (!this.h3Indexes || this.h3Indexes.length === 0) {
      return null;
    }
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
    const hasH3Index = this.#hexagonSet.has(h3Index);
    if (hasH3Index) {
      this.#hexagonSet.delete(h3Index);
    } else if (hasNoH3Index || hasNeighborH3Index) {
      this.#hexagonSet.add(h3Index);
    }
    // 4. 새로 만든 hexagon 객체를 지도 위에 polygon으로 그린다.
    this.draw(map);
    // 5. Hexagon 갯수가 변했으므로 eventListener들에게 알린다.
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.CHANGE);
    notifyEventListeners({
      eventListenerMap,
      hexagonGroup: this,
    });
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
      this.#naverMapsPolygon = polygon;
      this.#naverMapsPolygonListeners = listeners;
    }
  }

  /**
   * 지도 위의 naver polygon의 h3Index들을 설정합니다.
   *
   * @param {array} h3Indexes - h3Index의 배열
   *
   * @return {void} 없음
   */
  setH3Indexes(h3Indexes) {
    if (!h3Indexes || h3Indexes.length === 0) {
      throw new Error(`h3Indexes:${h3Indexes} 유효하지 않음`);
    }
    const found = h3Indexes.find((v) => !naverMapUtils.h3IsValid(v));
    if (found) {
      throw new Error(`found:${found} 유효하지 않음`);
    }

    if (this.#hexagonSet) {
      this.#hexagonSet.clear();
      this.#hexagonSet = null;
    }
    this.#hexagonSet = createHexagonSet(h3Indexes);
    if (this.#naverMapsPolygon) {
      const paths = hexagonCalculator.convertH3IndexesToNaverPolygonPaths([h3Indexes]);
      this.#naverMapsPolygon.setPaths(paths);
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

    if (this.#naverMapsPolygon) {
      this.#naverMapsPolygon.setStyles(this.getStylePolygonBorderFocus());
    }
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.FOCUS);
    notifyEventListeners({
      eventListenerMap,
      hexagonGroup: this,
      meta,
    });
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

    if (this.#naverMapsPolygon) {
      this.#naverMapsPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.BLUR);
    notifyEventListeners({
      eventListenerMap,
      hexagonGroup: this,
      meta,
    });
  }

  /**
   * 지도 위에 Hexagon을 Click 합니다.
   *
   * @param {object} meta (optional)호출자가 Click 시의 맥락 정보를 담은 meta 객체
   *
   * @return {void} 없음
   */
  click(meta = {}) {
    const eventListenerMap = this.#eventListenerMap.get(HEXAGON_EVENT.CLICK);
    notifyEventListeners({
      eventListenerMap,
      hexagonGroup: this,
      meta,
    });
  }

  /**
   * 지도 위에 Hexagon을 Disabled 합니다.
   *
   * @return {void} 없음
   */
  disabled() {
    this.#status = HEXAGON_STATUS.BLUR;

    if (this.#naverMapsPolygon) {
      this.#naverMapsPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
  }

  /**
   * 지도 위에 Hexagon의 Mode를 Unselected로 바꿉니다.
   *
   * @return {void} 없음
   */
  unselected() {
    this.#status = HEXAGON_STATUS.BLUR;

    if (this.#naverMapsPolygon) {
      this.#naverMapsPolygon.setStyles(this.getStylePolygonBorderBlur());
    }
  }

  /**
   * 지도 위에 Hexagon을 나타내는 모든 polygon을 지웁니다.
   *
   * @return {void} 없음
   */
  remove() {
    if (this.#naverMapsPolygon && this.#naverMapsPolygonListeners) {
      naverMapWrapper.removePolygon({
        polygon: this.#naverMapsPolygon,
        listeners: this.#naverMapsPolygonListeners,
      });
    }
    this.#naverMapsPolygon = null;
    this.#naverMapsPolygonListeners = null;
  }

  /**
   * Hexagon 객체를 없앱니다.
   *
   * @return {void} 없음
   */
  destroy() {
    this.remove();
    // eventListener 제거
    if (this.#eventListenerMap && this.#eventListenerMap.size > 0) {
      utils.convertMapToList(this.#eventListenerMap).forEach((map) => map.clear());
      this.#eventListenerMap.clear();
    }
    this.#eventListenerMap = null;
    // hexagon 맵 제거
    if (this.#hexagonSet && this.#hexagonSet.size > 0) {
      this.#hexagonSet.clear();
    }
    this.#hexagonSet = null;
  }
}

export default {
  // 1. create
  createHexagonGroup({
    h3Indexes = [],
    meta = {},
  }) {
    return new HexagonGroup({
      h3Indexes,
      meta,
    });
  },
  // 2. read
  // 2-1. bound
  getBound(hexagonGroups) {
    const bounds = hexagonGroups.map((v) => v.getBound());
    const mergedBound = bounds.reduce((acc, v) => {
      if (!acc && !v) {
        return null;
      }
      if (!acc) {
        return v;
      }
      if (!v) {
        return acc;
      }
      return acc.merge(v);
    }, null);
    return mergedBound;
  },
  // 3. update
  // 3-1. hexagonGroups에 새로운 hexagonGroup을 추가합니다.
  addHexagonGroup({
    hexagonGroups,
  }) {
    const hg = this.createHexagonGroup({});
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
