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
const getHtml = ({
  elementStatusMap,
  disabled,
}) => {
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
    disabled ? 'opacity: .5;' : 'opacity: 1;',
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

  #onSelectedPoint

  #onSelectedPolygon

  #onSelectedNone

  constructor({
    meta,
    onSelectedPoint,
    onSelectedPolygon,
    onSelectedNone,
  }) {
    this.#meta = meta;
    this.#onSelectedPoint = onSelectedPoint;
    this.#onSelectedPolygon = onSelectedPolygon;
    this.#onSelectedNone = onSelectedNone;
    this.#customControlGroup = customControlGroup.createCustomControlGroup({
      elementStatusMap: getElementStatusMapInitialized(),
      onChangeHtml: ({
        elementStatusMap,
        disabled,
      }) => (getHtml({
        elementStatusMap,
        disabled,
      })),
      onChangeSelectedElementKey: (key) => this.onChangeSelectedElementKey(key),
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

  /**
   * elementStatusMap의 element 중에서 선택된 element의 key가 바뀔 경우 호출되는 콜백
   *
   * @return {void} 리턴값 없음
   */
  onChangeSelectedElementKey({ key }) {
    const elementStatusMap = getElementStatusMapInitialized();
    switch (key) {
      case elementStatusMap.point.key:
        this.#onSelectedPoint({ key });
        break;
      case elementStatusMap.polygon.key:
        this.#onSelectedPolygon({ key });
        break;
      case '':
        this.#onSelectedNone({ key });
        break;
      default:
        throw new Error(`onChangeSelectedElementKey/key:${key}/유효하지 않습니다.`);
    }
  }

  /**
   * 전체 기능의 비활성화 여부를 설정합니다.
   *
   * @param {boolean} disabled - 전체 기능의 비활성화 여부
   *
   * @return {void} 리턴값 없음
   */
  setDisabled(disabled) {
    if (this.#customControlGroup.getDisabled === disabled) {
      // 같은 상태라면 중단합니다.
      return;
    }
    this.#customControlGroup.setDisabled(disabled);
    // TODO 시각적으로도 비활성화가 되었다는 것을 유저에게 보여줘야 함
  }

  /**
   * 외부에서 강제로 아무것도 선택하지 않은 상태로 바꿉니다.
   *
   * @return {void} 리턴값 없음
   */
  setSelectedNone() {
    this.#customControlGroup.setSelectedNone();
  }

  /**
   * 외부에서 강제로 엘리먼트를 업데이트 합니다.
   *
   * @return {void} 리턴값 없음
   */
  forceUpdate() {
    this.#customControlGroup.forceUpdate();
  }
}

export default {
  createCustomControlHexagonSelectorButtonGroup({
    meta = {},
    onSelectedPoint = () => ({}),
    onSelectedPolygon = () => ({}),
    onSelectedNone = () => ({}),
  }) {
    return new CustomControlHexagonSelectorButtonGroup({
      meta,
      onSelectedPoint,
      onSelectedPolygon,
      onSelectedNone,
    });
  },
};
