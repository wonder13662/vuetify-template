import naverMapWrapper from '../lib/naverMapWrapper';
import htmlElementEventHandler from '../htmlElementEventHandler';
import utils from '@/lib/utils';
import {
  NAVER_MAP_POSITION_MAP,
  NAVER_MAP_POSITION_SET,
} from '../lib/constants';

// eslint-disable-next-line max-len
const createEventController = ({
  key,
  meta,
  focus,
  blur,
  click,
}) => (htmlElementEventHandler.createHTMLElementEventController({
  onFocus: ({ meta: { key: keyFromMeta } }) => focus(keyFromMeta),
  onBlur: ({ meta: { key: keyFromMeta } }) => blur(keyFromMeta),
  onClick: ({ meta: { key: keyFromMeta } }) => click(keyFromMeta),
  meta: {
    ...meta,
    key,
  },
}));

const validateElementStatus = (elementStatusMap, elementStatus) => {
  if (!elementStatusMap) {
    throw new Error(`validateElementStatus/elementStatus:${elementStatusMap}/유효하지 않습니다.`);
  }
  if (!elementStatus) {
    throw new Error(`validateElementStatus/elementStatus:${elementStatus}/유효하지 않습니다.`);
  }
  if (!elementStatus.key) {
    throw new Error(`validateElementStatus/elementStatus.key:${elementStatus.key}/유효하지 않습니다.`);
  }
  if (!utils.isBoolean(elementStatus.focus)) {
    throw new Error(`validateElementStatus/elementStatus.focus:${elementStatus.focus}/유효하지 않습니다.`);
  }
  if (!utils.isBoolean(elementStatus.selected)) {
    throw new Error(`validateElementStatus/elementStatus.focus:${elementStatus.focus}/유효하지 않습니다.`);
  }
  if (!elementStatusMap[elementStatus.key]) {
    throw new Error(`validateElementStatus/elementStatusMap[${elementStatus.key}]:${elementStatusMap[elementStatus.key]}/유효하지 않습니다.`);
  }
};

class CustomControlButtonGroup {
  #html

  #meta

  #naverCustomControl

  #htmlElementEventControllerMap

  #map

  #elementStatusMap

  #onChangeHtml

  #onChangeElementStatusMap

  #position

  constructor({
    meta,
    onChangeHtml,
    onChangeElementStatusMap,
    elementStatusMap,
    position,
  }) {
    this.#meta = meta;
    this.#naverCustomControl = null;
    this.#onChangeHtml = onChangeHtml;
    this.#onChangeElementStatusMap = onChangeElementStatusMap;
    this.#position = position;

    // elementStatusMap 요소 검사
    this.#elementStatusMap = elementStatusMap;
    const elementStatusList = utils.convertObjValuesToList(this.#elementStatusMap);
    elementStatusList.forEach((v) => validateElementStatus(this.#elementStatusMap, v));

    this.#html = this.#onChangeHtml(this.#elementStatusMap);
    this.#htmlElementEventControllerMap = elementStatusList.reduce((acc, { key }) => {
      acc[key] = createEventController({
        key,
        meta: this.#meta,
        focus: (v) => this.focus(v),
        blur: (v) => this.blur(v),
        click: (v) => this.click(v),
      });
      return acc;
    }, {});
  }

  focus(key) {
    if (this.#elementStatusMap[key].focus) {
      return;
    }

    // 자신을 제외한 나머지 버튼들을 blur 상태로 바꾼다.
    const keys = utils.convertObjKeysToList(this.#elementStatusMap);
    keys.forEach((k) => {
      this.#elementStatusMap[k].focus = false;
    });

    // 사용자가 마우스를 올린 버튼은 foucs 시킨다.
    const target = this.#elementStatusMap[key];
    this.#elementStatusMap = {
      ...this.#elementStatusMap,
      [key]: {
        ...target,
        focus: true,
      },
    };
    this.forceUpdate();
    this.#onChangeElementStatusMap({
      elementStatusMap: {
        ...this.#elementStatusMap,
      },
    });
  }

  blur(key) {
    if (!this.#elementStatusMap[key].focus) {
      return;
    }

    const target = this.#elementStatusMap[key];
    this.#elementStatusMap = {
      ...this.#elementStatusMap,
      [key]: {
        ...target,
        focus: false,
      },
    };
    this.forceUpdate();
    this.#onChangeElementStatusMap({
      elementStatusMap: {
        ...this.#elementStatusMap,
      },
    });
  }

  click(key) {
    // 선택한 버튼의 상태를 가져온다
    const targetSelected = this.#elementStatusMap[key].selected;
    // 라디오 버튼처럼 1개만 selected 상태가 되도록 한다
    // 모든 버튼의 상태를 선택되지 않음(unselected)으로 바꾼다
    const keys = utils.convertObjKeysToList(this.#elementStatusMap);
    keys.forEach((k) => {
      this.#elementStatusMap[k].selected = false;
    });
    // 선택된 버튼의 상태를
    // 1. 선택됨(selected)이라면 선택되지 않음(unselected)
    // 2. 선택되지 않음(unselected)이라면 선택됨(selected)
    // 으로 바꾼다.
    const target = this.#elementStatusMap[key];
    this.#elementStatusMap = {
      ...this.#elementStatusMap,
      [key]: {
        ...target,
        selected: !targetSelected,
      },
    };
    this.forceUpdate();
    this.#onChangeElementStatusMap({
      elementStatusMap: {
        ...this.#elementStatusMap,
      },
    });
  }

  /**
   * 외부에서 인자로 전달한 key에 해당하는 elementStatusMap의 아이템을 업데이트 합니다.
   *
   * @param {string} key - elementStatusMap이 가지고 있는 아이템의 키
   * @param {object} props - elementStatusMap이 가지고 있는 아이템의 속성. 같은 속성이 있다면 덮어씁니다.
   *
   * @return {void} 리턴값 없음
   */
  setElementStatus({ key, props }) {
    if (!key || !this.#elementStatusMap[key]) {
      throw new Error(`setElementStatus/key:${key}/유효하지 않습니다.`);
    }
    if (!props) {
      throw new Error(`setElementStatus/props:${props}/유효하지 않습니다.`);
    }
    this.#elementStatusMap[key] = {
      ...this.#elementStatusMap[key],
      ...props,
    };
    this.#onChangeElementStatusMap({
      elementStatusMap: {
        ...this.#elementStatusMap,
      },
    });
  }

  /**
   * 외부에서 인자로 전달한 key에 해당하는 elementStatusMap의 아이템의 복사본(swallow copy)를 돌려줍니다.
   *
   * @param {string} key - elementStatusMap이 가지고 있는 아이템의 키
   *
   * @return {object} elementStatusMap의 아이템의 복사본(swallow copy)
   */
  getElementStatus({ key }) {
    if (!key || !this.#elementStatusMap[key]) {
      throw new Error(`setElementStatus/key:${key}/유효하지 않습니다.`);
    }
    return {
      ...this.#elementStatusMap[key],
    };
  }

  /**
   * 외부에서 customControllGroup을 강제로 업데이트합니다.
   *
   * @return {void} 리턴값 없음
   */
  forceUpdate() {
    const html = this.#onChangeHtml(this.#elementStatusMap);
    this.updateHtml(html);
    this.setEventController();
  }

  updateHtml(html) {
    this.#html = html;
    const htmlElement = this.#naverCustomControl.getElement();
    htmlElement.innerHTML = this.#html;
  }

  setEventController() {
    const htmlElement = this.#naverCustomControl.getElement();

    const elementStatusList = utils.convertObjValuesToList(this.#elementStatusMap);
    elementStatusList.forEach(({ key }) => {
      const target = this.#htmlElementEventControllerMap[key];
      target.remove();
      const htmlElementTarget = htmlElement.querySelector(`.${key}`);
      target.setElement(htmlElementTarget);
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
    this.#html = this.#onChangeHtml(this.#elementStatusMap);
    this.draw(this.#map);
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

    this.#naverCustomControl = naverMapWrapper.drawCustomControl({
      html: this.#html,
      map: this.#map,
      position: this.#position,
    });
    this.setEventController();
  }

  /**
   * 네이버 CustomControl 객체를 네이버 지도 객체 위에서 제거합니다.
   * draw()로 했던 모든 작업을 반대로 수행합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#naverCustomControl) {
      this.#naverCustomControl.setMap(null);
      this.#naverCustomControl = null;
    }

    const elementStatusList = utils.convertObjValuesToList(this.#elementStatusMap);
    elementStatusList.forEach(({ key }) => {
      const target = this.#htmlElementEventControllerMap[key];
      target.remove();
    });
  }

  /**
   * 네이버 CustomControl 객체를 완전히 삭제합니다.
   *
   * @return {void} 리턴값 없음
   */
  destroy() {
    this.remove();
    this.#html = null;
    this.#meta = null;
    this.#naverCustomControl = null;

    const elementStatusList = utils.convertObjValuesToList(this.#elementStatusMap);
    elementStatusList.forEach(({ key }) => {
      this.#htmlElementEventControllerMap[key] = null;
    });
    this.#htmlElementEventControllerMap = null;
  }
}

export default {
  // TODO 이벤트 리스너 콜백들을 인자로 받기
  createCustomControlGroup({
    elementStatusMap,
    onChangeHtml = () => ({}),
    onChangeElementStatusMap = () => ({}),
    position = NAVER_MAP_POSITION_MAP.RIGHT_CENTER,
    meta = {},
  }) {
    if (position && !NAVER_MAP_POSITION_SET.has(position)) {
      throw new Error(`createCustomControlGroup/position:${position}/유효하지 않습니다.`);
    }
    return new CustomControlButtonGroup({
      elementStatusMap,
      onChangeHtml,
      onChangeElementStatusMap,
      position,
      meta,
    });
  },
};
