import customControlGroup from './customControlGroup';
import utils from '@/lib/utils';

const getStyle = (focus, selected) => ([
  focus ? 'background: #BDBDBD;' : 'background: #EEEEEE;',
  selected ? 'color: black;' : 'color: grey;',
  'padding: 10px;',
  'margin: 4px;',
].join(''));

/*
 * 지도 위에 고정된 위치에 제공되는 버튼(CustomControl)
 *
 * 관련정보
 * https://navermaps.github.io/maps.js.ncp/docs/tutorial-4-control-custom-p1.example.html#
 * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.CustomControl.html
 *
*/
const getHtml = (elementStatusMap) => {
  const html = utils.convertObjValuesToList(elementStatusMap).map((v) => {
    const {
      key,
      focus,
      selected,
      meta: {
        name,
      },
    } = v;
    const style = getStyle(focus, selected);
    return `<div class="${key}" style="${style}">${name}</div>`;
  });

  const style = [
    'background: white;',
    'padding: 1px;',
    'margin: 10px;',
    'border: 1px solid black;',
  ].join('');

  return [
    `<div style="${style}">`,
    ...html,
    '</div>',
  ].join('');
};

const getElementStatusMapInitialized = () => ({
  point: {
    key: 'point',
    focus: false,
    selected: false,
    meta: {
      name: '점',
    },
  },
  polyline: {
    key: 'polyline',
    focus: false,
    selected: false,
    meta: {
      name: '직선',
    },
  },
  polygon: {
    key: 'polygon',
    focus: false,
    selected: false,
    meta: {
      name: '폴리곤',
    },
  },
});
class CustomControlHexagonSelectorButtonGroup {
  #customControlGroup

  #meta

  #map

  constructor({
    meta,
    onChange,
  }) {
    this.#meta = meta;
    this.#customControlGroup = customControlGroup.createCustomControlGroup({
      elementStatusMap: getElementStatusMapInitialized(),
      onChangeHtml: getHtml,
      onChangeElementStatusMap: onChange,
      meta: this.#meta,
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
    this.#customControlGroup.setNaverMap(this.#map);
    this.#customControlGroup.draw(this.#map);
  }

  /**
   * customControlGroup 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#customControlGroup) {
      this.#customControlGroup.remove();
    }
  }

  /**
   * customControlGroup 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    if (this.#customControlGroup) {
      this.#customControlGroup.destroy();
    }
    this.#customControlGroup = null;

    this.#meta = null;
    this.#map = null;
  }
}

export default {
  createCustomControlHexagonSelectorButtonGroup({
    meta = {},
    onChange = () => ({}),
  }) {
    return new CustomControlHexagonSelectorButtonGroup({
      meta,
      onChange,
    });
  },
};
