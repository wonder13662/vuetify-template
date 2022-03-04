import customControlGroupHandler from '../customControlGroupHandler';
import customControlBanner from '../customControlGroupHandler/customControlBanner';
import utils from '@/lib/utils';

class HexagonSelector {
  #hexagonSelectorButtonGroup

  #banner

  #meta

  #map

  #selectedMethod

  constructor({
    meta,
  }) {
    // eslint-disable-next-line max-len
    this.#meta = meta;
    this.#selectedMethod = '';
    // eslint-disable-next-line max-len
    this.#hexagonSelectorButtonGroup = customControlGroupHandler.createCustomControlHexagonSelectorButtonGroup({
      meta: this.#meta,
      onChange: ({ elementStatusMap }) => {
        // 여기서 선택된 엘리먼트를 추출
        const list = utils.convertObjValuesToList(elementStatusMap);
        const found = list.find(({ selected }) => selected);
        if (!found) {
          if (this.#selectedMethod === '') {
            return;
          }
          this.#selectedMethod = '';
          // eslint-disable-next-line no-console
          console.log('onChange / this.#selectedMethod:', this.#selectedMethod);
          return;
        }

        if (this.#selectedMethod === found.key) {
          return;
        }

        this.#selectedMethod = found.key;
        // eslint-disable-next-line no-console
        console.log('onChange / this.#selectedMethod:', this.#selectedMethod);
      },
    });
    this.#banner = customControlBanner.createCustomControlBanner({ meta });
    this.#banner.setBannerText('Hexagon을 선택할 방식(점, 직선, 폴리곤)을 지정해주세요.');
    this.#banner.setVisibleBtnSave(false);
    this.#banner.setVisibleBtnCancel(false);
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
    this.#hexagonSelectorButtonGroup.setNaverMap(this.#map);
    this.#banner.setNaverMap(this.#map);
  }

  /**
   * hexagonSelector 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#hexagonSelectorButtonGroup) {
      this.#hexagonSelectorButtonGroup.remove();
    }
    if (this.#banner) {
      this.#banner.remove();
    }
  }

  /**
   * hexagonSelector 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#hexagonSelectorButtonGroup) {
      this.#hexagonSelectorButtonGroup.destroy();
    }
    this.#hexagonSelectorButtonGroup = null;

    if (this.#banner) {
      this.#banner.destroy();
    }
    this.#banner = null;

    this.#meta = null;
    this.#map = null;
  }
}

export default {
  createHexagonSelector({
    meta = {},
  }) {
    return new HexagonSelector({ meta });
  },
};
