import customControlGroup from './customControlGroup';
import {
  NAVER_MAP_POSITION_MAP,
} from '../lib/constants';
import utils from '@/lib/utils';

// CustomControlBanner의 기능
// 1. 지도화면 최상단 중앙에 위치한다(확인 필요!)
// 2. 사용하는 쪽에서 배너에 표시될 텍스트를 입력받을 수 있다.
// 3. 사용하는 쪽에서 버튼을 visible 속성으로 보이거나 가릴 수 있다.
// 3-1. element의 갯수가 변경되면 관리해야 할 조건이 너무 많으므로 갯수를 고정하자.
// 4. 사용하는 쪽에서 버튼의 클릭 이벤트를 받을 수 있다.
// 5. 사용하는 쪽에서 배너를 가리거나 보여줄 수 있다.

const getStyle = ({
  key,
  focus,
  visible,
}) => {
  if (key === 'message') {
    // message는 focus, selected 이벤트에 영향을 받지 않습니다.
    return [
      'background: white;',
      'color: grey;',
      visible ? '' : 'display: none;',
      'padding: 10px;',
      'margin: 4px;',
    ].join('');
  }
  if (key === 'btnAdd') {
    return [
      focus ? 'background: #BDBDBD;' : 'background: #EEEEEE;',
      'color: black;',
      visible ? '' : 'display: none;',
      'padding: 10px;',
      'margin: 4px;',
    ].join('');
  }
  if (key === 'btnSubtract') {
    return [
      focus ? 'background: #BDBDBD;' : 'background: #EEEEEE;',
      'color: black;',
      visible ? '' : 'display: none;',
      'padding: 10px;',
      'margin: 4px;',
    ].join('');
  }
  // 'btnCancel'
  return [
    focus ? 'background: #BF360C;' : 'background: #E64A19;',
    'color: white;',
    visible ? '' : 'display: none;',
    'padding: 10px;',
    'margin: 4px;',
  ].join('');
};

const getHtml = ({
  elementStatusMap,
}) => {
  const html = utils.convertObjValuesToList(elementStatusMap).map((v) => {
    const {
      key,
      focus,
      visible,
      meta: {
        text,
      },
    } = v;
    const style = getStyle({
      key,
      focus,
      visible,
    });
    return `<div class="${key}" style="${style}">${text}</div>`;
  });

  const style = [
    'display: flex;',
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

// TODO 엘리먼트를 켜고 끄는(visible) 조건은 구현 컴포넌트에서만 알 수 있다.
// 그러므로 visible 속성은 구현 컴포넌트에서 제어할 수 있도록 해야 한다.
const getElementStatusMapInitialized = () => ({
  message: {
    key: 'message',
    focus: false,
    selected: false,
    visible: true,
    meta: {
      text: '텍스트',
    },
  },
  btnAdd: {
    key: 'btnAdd',
    focus: false,
    selected: false,
    visible: true,
    meta: {
      text: '더하기',
    },
  },
  btnSubtract: {
    key: 'btnSubtract',
    focus: false,
    selected: false,
    visible: true,
    meta: {
      text: '빼기',
    },
  },
  btnCancel: {
    key: 'btnCancel',
    focus: false,
    selected: false,
    visible: true,
    meta: {
      text: '취소',
    },
  },
});

class CustomControlBanner {
  #customControlGroup

  #meta

  #map

  #onClickBtnAdd

  #onClickBtnSubtract

  #onClickBtnCancel

  constructor({
    meta,
    onClickBtnAdd = () => ({}),
    onClickBtnSubtract = () => ({}),
    onClickBtnCancel = () => ({}),
  }) {
    this.#meta = meta;
    this.#onClickBtnAdd = onClickBtnAdd;
    this.#onClickBtnSubtract = onClickBtnSubtract;
    this.#onClickBtnCancel = onClickBtnCancel;
    this.#customControlGroup = customControlGroup.createCustomControlGroup({
      elementStatusMap: getElementStatusMapInitialized(),
      position: NAVER_MAP_POSITION_MAP.TOP_CENTER,
      meta: this.#meta,
      onChangeHtml: (elementStatusMap) => (getHtml(elementStatusMap)),
      onClick: ({ key }) => {
        // eslint-disable-next-line no-console
        console.log('onClick / key:', key);
        const elementStatusMap = getElementStatusMapInitialized();
        switch (key) {
          case elementStatusMap.btnAdd.key:
            this.#onClickBtnAdd();
            break;
          case elementStatusMap.btnSubtract.key:
            this.#onClickBtnSubtract();
            break;
          case elementStatusMap.btnCancel.key:
            this.#onClickBtnCancel();
            break;
          default:
            throw new Error(`key:${key}/유효하지 않습니다.`);
        }
      },
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
   * banner에 표시할 텍스트를 설정합니다.
   *
   * @return {void} 리턴값 없음
   */
  setBannerText(text) {
    this.#customControlGroup.setElementStatus({
      key: 'message',
      props: {
        meta: {
          text,
        },
      },
    });
  }

  /**
   * banner에 hexagon 더하기 버튼의 노출 여부를 외부에서 설정합니다.
   *
   * @param {boolean} visible - 더하기 버튼의 지도 위의 노출 여부
   *
   * @return {void} 리턴값 없음
   */
  setVisibleBtnAdd(visible) {
    this.#customControlGroup.setElementStatus({
      key: 'btnAdd',
      props: {
        visible,
      },
    });
  }

  /**
   * banner에 hexagon 빼기 버튼의 노출 여부를 외부에서 설정합니다.
   *
   * @param {boolean} visible - 빼기 버튼의 지도 위의 노출 여부
   *
   * @return {void} 리턴값 없음
   */
  setVisibleBtnSubtract(visible) {
    this.#customControlGroup.setElementStatus({
      key: 'btnSubtract',
      props: {
        visible,
      },
    });
  }

  /**
   * banner에 취소버튼의 노출 여부를 외부에서 설정합니다.
   *
   * @param {boolean} visible - 취소버튼의 지도 위의 노출 여부
   *
   * @return {void} 리턴값 없음
   */
  setVisibleBtnCancel(visible) {
    this.#customControlGroup.setElementStatus({
      key: 'btnCancel',
      props: {
        visible,
      },
    });
  }

  /**
   * banner를 강제로 업데이트합니다.
   *
   * @return {void} 리턴값 없음
   */
  forceUpdate() {
    this.#customControlGroup.forceUpdate();
  }
}

export default {
  createCustomControlBanner({
    meta = {},
    onClickBtnAdd = () => ({}),
    onClickBtnSubtract = () => ({}),
    onClickBtnCancel = () => ({}),
  }) {
    return new CustomControlBanner({
      meta,
      onClickBtnAdd,
      onClickBtnSubtract,
      onClickBtnCancel,
    });
  },
};
