import { v4 as uuidv4 } from 'uuid';
import mapUtils from '../lib/utils';
import pointMarkerHandler from '../pointMarkerHandler';
import polygonHandler from '../polygonHandler';
import overlayEventHandler from '../overlayEventHandler';

/**
 * PointMarker를 만들어 지도 위에 그립니다.
 *
 * @param {Point} point - Point 객체
 *
 * @return {PointMarker} PointMarker의 인스턴스
 */
const createPointMarker = (point, onClick) => {
  const pointMarker = pointMarkerHandler.createPointMarker({
    point,
    meta: {
      id: uuidv4(),
    },
  });
  pointMarker.addClickListener(({ meta: { id } }) => onClick(id));
  return pointMarker;
};

/**
 * Polygon을 만들어 지도 위에 그립니다.
 *
 * @param {array} points - Point 객체의 배열
 *
 * @return {Polygon} Polygon의 인스턴스
 */
const createPolygon = (map, points, onClick) => {
  const polygon = polygonHandler.createPolygon({ points });
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
  return polygon;
};

class PolygonSelector {
  #meta

  #polygon

  #pointMarkers

  #overlayMapEventHandler

  #map // naverMap 인스턴스

  // TODO 확장성을 위해서는 points를 외부에서 받을 수 있어야 한다.
  // TODO 삭제하는 방법은 선택시 pointMarker에 삭제 버튼을 노출하는 것으로 하자.

  /**
   * Points를 받아 네이버 지도 위에서 영역을 나타내는 폴리곤을 그립니다.
   * 사용자는 폴리곤의 점들을 선택하여 이동,삭제할 수 있습니다.
   * 사용자는 폴리곤 바깥의 영역을 클릭하여 폴리곤에 점을 추가할 수 있습니다.
   *
   * @param {object} meta - (optional)마커의 메타정보
   *
   * @return {Polygon} Polygon의 인스턴스
   */
  constructor({ meta }) {
    this.#meta = meta;

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
      meta: { ...this.#meta },
    });
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
    this.#pointMarkers.forEach((p) => p.remove());
    this.#polygon.remove();
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

    // 1. pointMakers 추가
    const pointMarker = createPointMarker(point, (id) => {
      const pointMarkerClicked = this.#pointMarkers.find((o) => o.meta.id === id);

      if (!this.#polygon && this.#pointMarkers.length <= 2) {
        return;
      }

      if (!this.#polygon) {
        // a. polyline 상태 -> polygon 상태로 바뀜
        // 지도 위에 표시된 pointMarker를 클릭한 것이므로 갇힌 다각형이 된다.
        // 이제 Polygon을 그린다.(사용자가 입력한 pointMarker의 순서대로 polygon을 그린다)
        this.#polygon = createPolygon(
          this.#map,
          this.#pointMarkers.map((p) => p.getPosition()),
          (v) => {
            const pointMarkerSelected = this.#pointMarkers.find((p) => p.isSelected());
            if (!pointMarkerSelected) {
              return;
            }
            // 선택된 pointMarker가 있다면 폴리곤 내부좌표로 pointMarker를 이동시킵니다.
            pointMarkerSelected.setPosition(v);
            // polygon도 업데이트합니다.
            this.#polygon.setPath(this.#pointMarkers.map((p) => p.getPosition()));
          },
        );
        return;
      }

      // b. polygon 상태
      // 닫힌 상태임. 사용자에게는 폴리곤으로 표시
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
    });
    pointMarker.draw(this.#map);

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
      this.#polygon.setPath(this.#pointMarkers.map((v) => v.getPosition()));
    }
  }
}

export default {
  createPolygonSelector({
    meta = {},
  }) {
    return new PolygonSelector({
      meta,
    });
  },
};
