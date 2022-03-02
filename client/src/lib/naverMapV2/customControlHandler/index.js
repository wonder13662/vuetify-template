import naverMapWrapper from '../lib/naverMapWrapper';
import htmlElementEventHandler from '../htmlElementEventHandler';
import utils from '@/lib/utils';

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
    const focus = v.focus ? '-focus' : '';
    const selected = v.selected ? '-selected' : '';
    return `<div class="${v.class}">${v.class}${focus}${selected}</div>`;
  });

  return [
    '<div>',
    ...html,
    '</div>',
  ].join('');
};

const getElementStatusMapInitialized = () => ({
  btn1: {
    key: 'btn1',
    class: 'btn1',
    focus: false,
    selected: false,
  },
  btn2: {
    key: 'btn2',
    class: 'btn2',
    focus: false,
    selected: false,
  },
  btn3: {
    key: 'btn3',
    class: 'btn3',
    focus: false,
    selected: false,
  },
});

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

class CustomControl {
  #html

  #meta

  #naverCustomControl

  #htmlElementEventControllerMap

  #map

  #elementStatusMap

  constructor({
    meta,
  }) {
    this.#meta = meta;
    this.#naverCustomControl = null;
    this.#elementStatusMap = getElementStatusMapInitialized();
    this.#html = getHtml(this.#elementStatusMap);
    this.#htmlElementEventControllerMap = {};
    const elementStatusList = utils.convertObjValuesToList(this.#elementStatusMap);
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

    const target = this.#elementStatusMap[key];
    this.#elementStatusMap = {
      ...this.#elementStatusMap,
      [key]: {
        ...target,
        focus: true,
      },
    };
    this.updateHtml();
    this.setEventController();
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
    this.updateHtml();
    this.setEventController();
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
    this.updateHtml();
    this.setEventController();
  }

  updateHtml() {
    const html = getHtml(this.#elementStatusMap);
    const htmlElement = this.#naverCustomControl.getElement();
    htmlElement.innerHTML = html;
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
  createCustomControl({
    meta = {},
  }) {
    return new CustomControl({
      meta,
    });
  },
};
