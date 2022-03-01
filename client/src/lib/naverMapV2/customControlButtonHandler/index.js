import customControlHandler from '../customControlHandler';

class CustomControlButton {
  #html

  #meta

  #customControl

  #map

  constructor({
    meta,
  }) {
    this.#html = '<div>TEST</div>';
    this.#meta = { ...meta };
    this.#customControl = customControlHandler.createCustomControl({
      html: this.#html,
      meta: this.#meta,
    });
    this.#map = null;
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
    this.#customControl.setNaverMap(map);
    this.draw(this.#map);
    // eslint-disable-next-line no-console
    console.log('ccbh / setNaverMap / 99');
  }

  /**
   * 네이버 CustomControl 객체를 지도 위에 그립니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Polygon.html
   *
   * @param {object} map - (required) 네이버 맵 인스턴스
   *
   * @return {void} 반환값 없음
   */
  draw(map) {
    if (!map) {
      throw new Error(`map:${map}/유효하지 않음`);
    }

    // NOTE: 지도 위에 표시되는 인스턴스는 1개여야 하므로 이전에 인스턴스 내에서 그린 마커가 있다면 지웁니다.
    this.remove();
    this.#customControl.draw(map);
    // eslint-disable-next-line no-console
    console.log('ccbh / draw / 99');
  }

  /**
   * 네이버 폴리곤을 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    this.#customControl.remove();
  }

  /**
   * Polygon 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    this.#customControl.destroy();
  }
}

export default {
  createCustomControlButton({
    meta = {},
  }) {
    return new CustomControlButton({
      meta,
    });
  },
};
