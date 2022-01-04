import hexagonCalculator from '../lib/hexagonCalculator';
import {
  DEFAULT_ZOOM,
  HEXAGON_STATUS,
  HEXAGON_STATUS_SET,
} from '../lib/constants';
import hexagonHandler from './hexagonHandler';
import naverMapWrapper from '../lib/naverMapWrapper';

// TODO 특정 hexagonGroup이 편집 모드일때, 나머지 hexagonGroup은 비활성 모드
// const MODE_DISABLED = 'MODE_DISABLED';
const MODE_READ_ONLY = 'MODE_READ_ONLY';
const MODE_EDIT = 'MODE_EDIT';

// TODO 멤버 변수의 private 선언 필요

const drawReadOnlyMode = ({
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
    onClick,
  });

  return {
    polygon,
    listeners,
  };
};

const drawEditMode = ({
  map,
  hexagonMap,
  zoomLevel,
}) => {
  if (!map) {
    throw new Error('map: 유효하지 않음');
  }
  if (!hexagonMap) {
    throw new Error('hexagonMap: 유효하지 않음');
  }

  // 1. 맵 위에 그려져 있던 hexagon을 모두 지웁니다.
  const hexagons = Object.values(hexagonMap);
  hexagons.forEach((hexagon) => (hexagon.remove()));

  // 2. 일정 줌 레벨 이하면 도형을 그리지 않습니다.
  if (!naverMapWrapper.isZoomLevelPolygonVisible(zoomLevel)) {
    return;
  }

  // 3. 유저가 보고 있는 화면 안에 있는 hexagon만 골라내 그립니다.
  const h3IndexesInBounds = hexagonCalculator.getH3IndexesInBounds(map.getBounds());
  h3IndexesInBounds.forEach((h3Index) => {
    if (hexagonMap.has(h3Index)) {
      hexagonMap.get(h3Index).draw(map);
    }
  });
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
  constructor(
    hexagonGroupName,
    h3Indexes = [],
    driverCnt = 0,
    subDeliveryCnt = 0,
    meta = {},
    onFocus = () => {},
    onBlur = () => {},
    onClick = () => {},
    isEditable = false,
  ) {
    this.hexagonGroupName = hexagonGroupName;
    this.hexagonMap = createHexagonMap(new Map(), h3Indexes);
    this.driverCnt = driverCnt;
    this.subDeliveryCnt = subDeliveryCnt;
    this.meta = meta;
    this.mode = MODE_READ_ONLY;
    this.zoomLevel = DEFAULT_ZOOM;
    this.hexagonGroupReadOnlyPolygon = null;
    this.hexagonGroupReadOnlyListeners = null;
    this.stylePolygonBorderFocus = null;
    this.stylePolygonBorderBlur = null;
    this.status = HEXAGON_STATUS.HEXAGON_UNSELECTED;
    this.onFocus = onFocus;
    this.onBlur = onBlur;
    this.onClick = onClick;
    this.isEditable = isEditable;
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
    this.mode = mode;
  }

  /**
   * HexagonGroup의 모드 상태가 읽기 모드인지 여부를 알려줍니다.
   *
   * @return {boolean} 읽기 모드인지 여부
   */
  isReadOnlyMode() {
    return this.mode === MODE_READ_ONLY;
  }

  /**
   * HexagonGroup의 모드 상태가 편집 모드인지 여부를 알려줍니다.
   *
   * @return {boolean} 편집 모드인지 여부
   */
  isEditMode() {
    return this.mode === MODE_EDIT;
  }

  /**
   * HexagonGroup에서 가지고 있는 h3Index의 배열을 돌려줍니다.
   *
   * @return {void} 없음
   */
  get h3Indexes() {
    return [...this.hexagonMap.keys()];
  }

  /**
   * Naver 맵의 줌 레벨을 설정합니다.
   *
   * @param {number} 변경된 줌 레벨
   *
   * @return {void} 없음
   */
  setZoomLevel({ map, zoomLevel }) {
    this.zoomLevel = zoomLevel;

    // TODO 편집 모드일 경우, 줌 레벨을 제한해야 한다.

    if (this.isEditMode()) {
      this.remove();
      this.draw(map);
    }
  }

  /**
   * Naver 맵의 bounds가 변경되면 이 콜백을 호출합니다.
   *
   * @param {object} map (required)naver map의 인스턴스
   * @param {object} bounds (required)변경된 naver bounds
   *
   * @return {void} 없음
   */
  onBoundChanged({ map, bounds }) {
    if (!this.isEditMode()) {
      return;
    }
    this.remove();
    this.draw({ map, bounds });
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
    // 2. h3Index로 hexagon 객체를 새로 만든다
    const hexagon = createHexagon(this.hexagonMap, h3Index);
    // 3. 새로 만든 hexagon 객체를 hexagonGroups에 추가한다.
    setHexagonToHexagonMap(this.hexagonMap, hexagon);
    // 4. 새로 만든 hexagon 객체를 지도 위에 그린다.
    hexagon.draw(map);
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseover 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.stylePolygonBorderBlur
   */
  getStylePolygonBorderFocus() {
    if (!this.stylePolygonBorderFocus) {
      return hexagonCalculator.getStylePolygonBorderFocus();
    }
    return this.stylePolygonBorderFocus;
  }

  /**
   * Naver 맵 위의 hexagonGroup에 mouseout 이벤트가 발생할 때, 적용되는 스타일을 줍니다.
   *
   * @return {string} this.stylePolygonBorderBlur
   */
  getStylePolygonBorderBlur() {
    if (this.status === HEXAGON_STATUS.HEXAGON_UNSELECTED) {
      return hexagonCalculator.getStylePolygonBorder();
    }
    if (this.status === HEXAGON_STATUS.HEXAGON_SELECTED) {
      return hexagonCalculator.getStylePolygonSelected();
    }
    if (this.status === HEXAGON_STATUS.HEXAGON_DISABLED) {
      return hexagonCalculator.getStylePolygonDisabled();
    }
    return this.stylePolygonBorderBlur;
  }

  /**
   * HexagonGroup 생성시에 사용자가 입력한 meta 객체의 복사본을 돌려줍니다.
   *
   * @return {object} 사용자 meta 객체
   */
  getMeta() {
    return {
      ...this.meta,
    };
  }

  /**
   * meta 객체를 설정합니다.
   *
   * @param {string} arg (required) 사용자 meta 객체
   *
   * @return {void} 없음
   */
  setMeta(arg) {
    this.meta = {
      ...arg,
    };
  }

  /**
   * Hexagon의 상태를 설정합니다. 아래 값 중 하나여야 합니다.
   * 1. HEXAGON_UNSELECTED
   * 2. HEXAGON_SELECTED
   * 3. HEXAGON_DISABLED
   *
   * @param {string} arg (required) Hexagon의 상태
   *
   * @return {void} 없음
   */
  setStatus(arg) {
    if (!HEXAGON_STATUS_SET.has(arg)) {
      throw new Error(`arg:${arg}: 유효하지 않습니다.`);
    }
    this.status = arg;
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

    if (this.isEditMode() && naverMapWrapper.isZoomLevelPolygonVisible(this.zoomLevel)) {
      // TODO 3. zoomLevel을 변경할 수 있는 범위를 제한한다.
      drawEditMode({
        map,
        hexagonMap: this.hexagonMap,
      });
    } else if (this.isReadOnlyMode()) {
      const { polygon, listeners } = drawReadOnlyMode({
        map,
        h3Indexes: this.h3Indexes,
        style: this.getStylePolygonBorderBlur(),
        onFocus: () => {
          this.focus();
        },
        onBlur: () => {
          this.blur();
        },
        onClick: () => {
          this.onClick(this);

          if (!this.isEditable) {
            return;
          }
          // TODO 요거 리팩터링해서 별도 메서드로 추출하자.
          // 0. zoomLevel이 유효하지 않으면 사용자에게 알림. 그리고 중단
          if (!naverMapWrapper.isZoomLevelPolygonVisible(this.zoomLevel)) {
            // TODO 사용자에게 알림 메시지를 전달하는 콜백을 추가해야 함
            // eslint-disable-next-line no-console
            console.log('현재 줌 레벨로는 편집모드의 폴리곤을 그릴 수 없습니다. 줌 레벨을 낮추어야 합니다.');
            return;
          }
          // 1. 읽기모드의 polygon을 삭제함
          this.remove();
          // 2. 클릭하면 모드가 변경됨
          this.setMode(MODE_EDIT);
          // TODO 3. zoomLevel을 변경할 수 있는 범위를 제한한다.
          // 3. 편집모드의 polygon을 지도 위에 그림
          drawEditMode({
            map,
            hexagonMap: this.hexagonMap,
            zoomLevel: this.zoomLevel,
          });
        },
      });

      this.hexagonGroupReadOnlyPolygon = polygon;
      this.hexagonGroupReadOnlyListeners = listeners;
    }
  }

  /**
   * 지도 위에 Hexagon을 Focus시킵니다.
   *
   * @return {void} 없음
   */
  focus() {
    this.onFocus(this);
    if (!this.hexagonGroupReadOnlyPolygon) {
      return;
    }
    const styles = this.getStylePolygonBorderFocus();
    this.hexagonGroupReadOnlyPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 Blur시킵니다.
   *
   * @return {void} 없음
   */
  blur() {
    this.onBlur(this);
    if (!this.hexagonGroupReadOnlyPolygon) {
      return;
    }
    const styles = this.getStylePolygonBorderBlur();
    this.hexagonGroupReadOnlyPolygon.setStyles(styles);
  }

  /**
   * 지도 위에 Hexagon을 나타내는 모든 polygon을 지웁니다.
   *
   * @return {void} 없음
   */
  remove() {
    if (this.hexagonMap.size > 0) {
      const hexagons = Object.values(this.hexagonMap);
      hexagons.forEach((hexagon) => (hexagon.remove()));
    }

    if (this.hexagonGroupReadOnlyPolygon && this.hexagonGroupReadOnlyListeners) {
      naverMapWrapper.removePolygon({
        polygon: this.hexagonGroupReadOnlyPolygon,
        listeners: this.hexagonGroupReadOnlyListeners,
      });
    }

    this.mode = MODE_READ_ONLY;
  }
}

export default {
  // 1. create
  createHexagonGroup({
    hexagonGroupName,
    h3Indexes = [],
    driverCnt = 0,
    subDeliveryCnt = 0,
    meta = {},
    onFocus = () => {},
    onBlur = () => {},
    onClick = () => {},
    isEditable = false,
  }) {
    return new HexagonGroup(
      hexagonGroupName,
      h3Indexes,
      driverCnt,
      subDeliveryCnt,
      meta,
      onFocus,
      onBlur,
      onClick,
      isEditable,
    );
  },
  // 2. update
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
    hexagonGroups.forEach((v) => v.setZoomLevel({
      map,
      zoomLevel,
    }));
  },
  // 2-4. onClick
  setClickedPoint({
    map,
    hexagonGroups,
    point,
  }) {
    hexagonGroups.forEach((v) => v.setClickedPoint({ map, point }));
  },
  blurHexagonGroups(hexagonGroups) {
    if (!hexagonGroups || hexagonGroups.length === 0) {
      return;
    }
    hexagonGroups.forEach((v) => v.blur());
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
