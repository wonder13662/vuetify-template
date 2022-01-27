import hexagonCalculator from '../../lib/hexagonCalculator';
import naverMapWrapper from '../../lib/naverMapWrapper';
import utils from '../../lib/utils';

const STATUS_NONE = 'STATUS_NONE';
const STATUS_FOCUS = 'STATUS_FOCUS';
const STATUS_BLUR = 'STATUS_BLUR';

class Hexagon {
  constructor({
    h3Index,
    visible,
    onRemove = () => {},
  }) {
    this.h3Index = h3Index;
    this.visible = visible;
    this.naverMapsPolygon = null;
    this.status = STATUS_NONE;
    this.listeners = [];
    this.onRemove = onRemove;
  }

  /**
   * 지도 위의 naver polygon의 visible 상태값을 설정합니다.
   *
   * @param {boolean} visible naver polygon의 visible 상태 여부
   *
   * @return {void} 없음
   */
  setVisible(visible) {
    this.visible = visible;
    if (this.naverMapsPolygon) {
      this.naverMapsPolygon.setVisible(visible);
    }
  }

  /**
   * 지도 위의 naver polygon의 h3Index를 설정합니다.
   *
   * @param {string} h3Index 도형 좌표 목록
   *
   * @return {void} 없음
   */
  setH3Index(h3Index) {
    if (!utils.h3IsValid(h3Index)) {
      throw new Error(`h3Index:${h3Index} 유효하지 않음`);
    }
    this.h3Index = h3Index;
    if (this.naverMapsPolygon) {
      const paths = hexagonCalculator.convertH3IndexesToNaverPolygonPaths([this.h3Index]);
      this.naverMapsPolygon.setPaths(paths);
    }
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
      visible: this.visible,
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

  /**
   * Hexagon 객체를 없앱니다.
   *
   * @return {void} 없음
   */
  destroy() {
    this.remove();
    // eventListener 제거
    this.listeners = [];
    // hexagon 제거
    this.naverMapsPolygon = null;
  }
}

export default {
  createHexagon: ({
    h3Index,
    visible,
    onRemove = () => {},
  }) => (new Hexagon({
    h3Index,
    visible,
    onRemove,
  })),
};
