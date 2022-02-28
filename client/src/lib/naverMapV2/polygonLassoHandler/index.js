import { v4 as uuidv4 } from 'uuid';
import mapUtils from '../lib/utils';
import pointMarkerHandler from '../pointMarkerHandler';
import polygonHandler from '../polygonHandler';
import overlayEventHandler from '../overlayEventHandler';

const MODE_READ = 'MODE_READ';
const MODE_EDIT = 'MODE_EDIT';

/**
 * PointMarker를 만들어 지도 위에 그립니다.
 *
 * @param {Point} point - Point 객체
 *
 * @return {PointMarker} PointMarker의 인스턴스
 */
const createPointMarker = ({
  point,
  onClick = () => ({}),
  onRightClick = () => ({}),
}) => {
  const pointMarker = pointMarkerHandler.createPointMarker({
    point,
    meta: {
      id: uuidv4(),
    },
  });
  pointMarker.addClickListener(({ meta: { id } }) => onClick(id));
  pointMarker.addRightClickListener(({ meta: { id } }) => onRightClick(id));
  return pointMarker;
};

/**
 * Polygon을 만들어 지도 위에 그립니다.
 *
 * @param {array} points - Point 객체의 배열
 *
 * @return {Polygon} Polygon의 인스턴스
 */
const createPolygon = ({
  map,
  points,
  clickable = false,
  onClick = () => ({}),
  onMousemove = () => ({}),
}) => {
  const polygon = polygonHandler.createPolygon({ points, clickable });
  polygon.draw(map);
  polygon.addClickListener((v) => {
    const {
      _lat: lat,
      _lng: lng,
    } = v.coord;
    const point = {
      lat,
      lng,
    };
    onClick(point);
  });

  polygon.addMousemoveListener((v) => {
    const {
      _lat: lat,
      _lng: lng,
    } = v.coord;
    const point = {
      lat,
      lng,
    };
    onMousemove(point);
  });

  return polygon;
};

class PolygonSelector {
  #meta

  #polygon

  #pointMarkers

  #overlayMapEventHandler

  #map // naverMap 인스턴스

  #mode

  #onChange

  // TODO 확장성을 위해서는 points를 외부에서 받을 수 있어야 한다.
  // TODO 삭제하는 방법은 선택시 pointMarker에 삭제 버튼을 노출하는 것으로 하자.

  /**
   * Points를 받아 네이버 지도 위에서 영역을 나타내는 폴리곤을 그립니다.
   * 사용자는 폴리곤의 점들을 선택하여 이동,삭제할 수 있습니다.
   * 사용자는 폴리곤 바깥의 영역을 클릭하여 폴리곤에 점을 추가할 수 있습니다.
   *
   * @param {object} meta - (optional)마커의 메타정보
   * @param {function} onChange - (optional)point가 추가되거나 제거될 때 호출되는 콜백
   *
   * @return {Polygon} Polygon의 인스턴스
   */
  constructor({
    meta,
    onChange = () => ({}),
  }) {
    this.#meta = meta;
    this.#onChange = onChange;

    // 1. 포인트를 나타내는 포인트 마커 만들기
    this.#pointMarkers = [];

    // 2. 포인트를 감싸는 폴리곤(다각형) 객체 만들기
    this.#polygon = null;

    // 3. 맵의 클릭 이벤트를 받는 overlayEventHandler 추가
    this.#overlayMapEventHandler = overlayEventHandler.createOverlayEventController({
      onFocus: () => {},
      onBlur: () => {},
      onClick: (v) => {
        const {
          _lat: lat,
          _lng: lng,
        } = v.coord;
        const point = {
          lat,
          lng,
        };

        // 클릭한 지점을 입력받으려면 편집모드(MODE_EDIT)여야 한다.
        if (this.isModeRead()) {
          return;
        }

        // pointMarker와 polygon을 제외한 지도 영역을 클릭하면,
        const pointMarkerSelected = this.#pointMarkers.find((p) => p.isSelected());
        if (pointMarkerSelected) {
          // 1-1. pointMarker가 선택되어 있다면 pointMarker의 이동
          pointMarkerSelected.setPosition(point);
          // 1-2. polygon이 이미 만들어져 있다면, polygon의 path를 업데이트
          if (this.#polygon) {
            this.#polygon.setPath(this.#pointMarkers.map((p) => p.getPosition()));
          }
          return;
        }
        // 2. 선택된 pointMarker가 없다면 pointMarker의 추가
        this.addPoint(point);
      },
      onMousemove: (v) => {
        // 선택된 마커가 없다면 중단합니다.
        const pointMarkerSelected = this.#pointMarkers.find((p) => p.isSelected());
        if (!pointMarkerSelected) {
          return;
        }

        // 마우스의 좌표를 가져옵니다.
        const {
          _lat: lat,
          _lng: lng,
        } = v.coord;
        const point = {
          lat,
          lng,
        };

        pointMarkerSelected.setPosition(point);
        if (this.#polygon) {
          this.#polygon.setPath(this.#pointMarkers.map((p) => p.getPosition()));
        }
      },
      meta: { ...this.#meta },
    });

    // 4. 최초의 모드는 읽기모드(MODE_READ)입니다.
    this.#mode = MODE_READ;
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
    this.draw(this.#map);
  }

  /**
   * 네이버 맵 위에 PolygonSelector를 그립니다.
   * Overlay 타입의 필수 구현 메서드입니다.
   *
   * @param {object} map - (required)네이버 맵 객체
   *
   * @return {void} 리턴값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }
    this.#pointMarkers.forEach((p) => p.draw());
    if (this.#polygon) {
      this.#polygon.draw();
    }
    this.#overlayMapEventHandler.setOverlay(map);
  }

  /**
   * 네이버 맵 위에 PolygonSelector를 지웁니다.
   * Overlay 타입의 필수 구현 메서드입니다.
   *
   * @return {void} 리턴값 없음
   */
  remove() {
    this.#pointMarkers.forEach((p) => p.destroy());
    this.#pointMarkers = [];
    if (this.#polygon) {
      this.#polygon.destroy();
      this.#polygon = null;
    }
  }

  /**
   * PolygonSelector 객체를 삭제합니다.
   * 관련 필드를 모두 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    this.#pointMarkers.forEach((p) => p.destroy());
    this.#polygon.destroy();

    this.#meta = null;
    this.#polygon = null;
    this.#pointMarkers = null;

    this.#overlayMapEventHandler.remove();
    this.#overlayMapEventHandler = null;
  }

  /**
   * 새로운 point를 추가합니다.
   *
   * @param {object} point - lat, lng 속성을 가지는 객체
   *
   * @return {void} 반환값 없음
   */
  addPoint(point) {
    if (!mapUtils.isValidPoint(point)) {
      throw new Error(`point:${point}/유효하지 않습니다.`);
    }
    if (!this.#map) {
      throw new Error(`this.#map:${this.#map}/유효하지 않습니다.`);
    }
    if (this.isModeRead()) {
      throw new Error(`this.#mode:${this.#mode}/편집모드에서만 Point 추가가 가능합니다.`);
    }

    // 1. pointMakers 추가
    const pointMarker = createPointMarker({
      point,
      onClick: (id) => {
        // 사용자가 pointMarker를 클릭했습니다.
        if (!this.#polygon && this.#pointMarkers.length <= 2) {
          return;
        }

        // b. polygon 상태
        // 닫힌 상태임. 사용자에게는 폴리곤으로 표시
        const pointMarkerClicked = this.#pointMarkers.find((o) => o.meta.id === id);
        if (!pointMarkerClicked || pointMarkerClicked.isDisabled()) {
          return;
        }
        // 2-1. pointMarker가 SELECTED
        if (pointMarkerClicked.isSelected()) {
          // 2-1-1. SELECTED 상태로 바뀌면, 이외의 다른 point들은 모두 disabled 상태로 바꿉니다.
          this.#pointMarkers.forEach((o) => {
            if (o.meta.id !== id) {
              o.setDisabled();
            }
          });
        }
        // 2-2. pointMarker가 UNSELECTED
        if (pointMarkerClicked.isUnselected()) {
          // 2-2-1. UNSELECTED 상태로 바뀌면, 모든 point들을 모두 enabled 상태로 바꿉니다.
          this.#pointMarkers.forEach((o) => o.setEnabled());
          // pointMarker들의 좌표를 points에 업데이트합니다.
        }
      },
      onRightClick: (id) => {
        // 사용자가 pointMarker를 오른쪽 클릭했습니다.
        // 해당 pointMarker를 삭제합니다.
        const found = this.#pointMarkers.find((p) => p.meta.id === id);
        if (!found) {
          return;
        }
        // 1. pointMarker 배열에서 해당 pointMarker를 제외
        this.#pointMarkers = this.#pointMarkers.filter((p) => p.meta.id !== id);
        // 2. 해당 pointMarker 삭제
        found.destroy();
        const pointsAfterRightClick = this.#pointMarkers.map((p) => p.getPosition());
        // 3. polygon 업데이트
        if (this.#pointMarkers.length > 0 && this.#polygon) {
          // 3-1. pointMaker가 1개 이상 있고, polygon이 있다면 남은 pointMarker로 다시 그립니다.
          this.#polygon.setPath(pointsAfterRightClick);
        } else {
          // 3-2. pointMaker가 없다면, polygon을 삭제합니다.
          this.#polygon.destroy();
          this.#polygon = null;
        }
        // 4. 콜백호출
        this.#onChange({
          points: pointsAfterRightClick,
        });
      },
    });
    pointMarker.draw(this.#map);

    // 2. 새로운 pointMarker를 pointMarker의 목록에 어디에 넣을지 결정한다.
    if (!this.#polygon) {
      // 2-1. polygon이 아직 없다면 새로 만든 pointMarker를 배열에 추가
      this.#pointMarkers.push(pointMarker);
    } else {
      // 2-2. polygon이 이미 만들어져 있다면,
      // 새로 만든 pointMarker를 가장 가까운 2개의 pointMarker들의 사이에 넣는다.
      const result = this.#pointMarkers.map((v, idx, src) => {
        const prev = idx;
        const next = (idx + 1) % src.length;
        const distancePrevToPoint = mapUtils.pointDist(v.getPosition(), point);
        const distanceNextToPoint = mapUtils.pointDist(src[next].getPosition(), point);
        const distance = distancePrevToPoint + distanceNextToPoint;
        return {
          prev,
          next,
          distance,
        };
      });
      result.sort((a, b) => a.distance - b.distance);
      this.#pointMarkers.splice(result[0].next, 0, pointMarker);
    }

    const points = this.#pointMarkers.map((p) => p.getPosition());

    // 3. polygon 업데이트
    if (!this.#polygon) {
      // 3-1. polygon이 없다면 만듭니다.
      this.#polygon = createPolygon({
        map: this.#map,
        points,
        // 지도의 mousemove 이벤트를 받기 위해 폴리곤 자체의 이벤트는 받지 않습니다.
        clickable: false,
      });
    } else {
      // 3-2. polygon이 있다면 path를 다시 그린다.
      this.#polygon.setPath(points);
    }

    // 4. 콜백호출
    this.#onChange({
      points,
    });
  }

  /**
   * 읽기모드(MODE_READ)로 바꿉니다.
   *
   * @return {void} 반환값 없음
   */
  setModeRead() {
    this.#mode = MODE_READ;
  }

  /**
   * 읽기모드(MODE_READ)인지 여부
   *
   * @return {boolean} 읽기모드(MODE_READ) 여부 플래그값
   */
  isModeRead() {
    return this.#mode === MODE_READ;
  }

  /**
   * 편집모드(MODE_EDIT)로 바꿉니다.
   *
   * @return {void} 반환값 없음
   */
  setModeEdit() {
    this.#mode = MODE_EDIT;
  }

  /**
   * 편집모드(MODE_EDIT)인지 여부
   *
   * @return {boolean} 편집모드(MODE_EDIT)인지 여부 플래그값
   */
  isModeEdit() {
    return this.#mode === MODE_EDIT;
  }
}

export default {
  createPolygonSelector({
    meta = {},
    onChange = () => ({}),
  }) {
    return new PolygonSelector({
      meta,
      onChange,
    });
  },
};
