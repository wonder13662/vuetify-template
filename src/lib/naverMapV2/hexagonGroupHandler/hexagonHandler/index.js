import hexagonCalculator from '../../lib/hexagonCalculator';
import naverMapWrapper from '../../lib/naverMapWrapper';

const STATUS_NONE = 'STATUS_NONE';
const STATUS_FOCUS = 'STATUS_FOCUS';
const STATUS_BLUR = 'STATUS_BLUR';

class Hexagon {
  constructor({
    h3Index,
    onRemove = () => {},
  }) {
    this.h3Index = h3Index;
    this.naverMapsPolygon = null;
    this.status = STATUS_NONE;
    this.listeners = [];
    this.onRemove = onRemove;
  }

  /**
   * 지도 위의 Hexagon이 focus(mouseover) 상태인지 알려줍니다
   *
   * @return {boolean} focus(mouseover) 상태 여부
   */
  isFocus() {
    return this.status === STATUS_FOCUS;
  }

  /**
   * 지도 위의 Hexagon이 blur(mouseout) 상태인지 알려줍니다
   *
   * @return {boolean} blur(mouseout) 상태 여부
   */
  isBlur() {
    return this.status === STATUS_BLUR;
  }

  /**
   * 지도 위의 Hexagon의 mouseover시에 focus 상태를 저장 및 표시합니다.
   *
   * @return {void} 없음
   */
  focus() {
    if (!this.naverMapsPolygon) {
      throw new Error('this.naverMapsPolygon: 유효하지 않음');
    }

    this.status = STATUS_FOCUS;
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setStyles__anchor
    this.naverMapsPolygon.setStyles(hexagonCalculator.getStyleHexagonFocus());
  }

  /**
   * 지도 위의 Hexagon의 mouseout시에 blur 상태를 저장 및 표시합니다.
   *
   * @return {void} 없음
   */
  blur() {
    if (!this.naverMapsPolygon) {
      throw new Error('this.naverMapsPolygon: 유효하지 않음');
    }

    this.status = STATUS_BLUR;
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html#setStyles__anchor
    this.naverMapsPolygon.setStyles(hexagonCalculator.getStyleHexagonBlur());
  }

  /**
   * 지도 위에 Hexagon을 나타내는 polygon을 그립니다.
   *
   * @param {object} naver naver map api 네임스페이스
   * @param {object} map naver map 인스턴스
   *
   * @return {void} 없음
   */
  draw(map) {
    if (!map) {
      throw new Error('map: 유효하지 않음');
    }

    // eslint-disable-next-line max-len
    const naverPolygonPaths = hexagonCalculator.convertH3IndexesToNaverPolygonPaths([this.h3Index]);
    const style = hexagonCalculator.getStyleHexagonBlur();
    this.status = STATUS_BLUR;
    const { polygon, listeners } = naverMapWrapper.drawPolygon({
      map,
      naverPolygonPaths,
      style,
      onMouseover: () => {
        this.focus();
      },
      onMouseout: () => {
        this.blur();
      },
      onClick: () => {
        // 1. 지도 위에 hexagon을 지운다.
        this.remove();
        // 2. 부모 hexagonGroup에 hexagon이 지워졌다는 것을 알려준다.
        this.onRemove(this.h3Index);
      },
    });

    this.naverMapsPolygon = polygon;
    this.listeners = listeners;
  }

  /**
   * 지도 위에 Hexagon을 나타내는 polygon을 제거합니다.
   *
   * @return {void} 없음
   */
  remove() {
    if (!this.naverMapsPolygon) {
      return;
    }

    naverMapWrapper.removePolygon({
      polygon: this.naverMapsPolygon,
      listeners: this.listeners,
    });
    this.status = STATUS_NONE;
  }
}

export default {
  createHexagon: ({
    h3Index,
    onRemove = () => {},
  }) => (new Hexagon({
    h3Index,
    onRemove,
  })),
};
