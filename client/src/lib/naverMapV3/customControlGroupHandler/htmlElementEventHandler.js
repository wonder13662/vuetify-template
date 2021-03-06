import { v4 as uuidv4 } from 'uuid';
import {
  OVERLAY_EVENT,
  OVERLAY_EVENT_SET,
  OVERLAY_STATUS,
} from '../lib/constants';
import naverMapWrapper from '../lib/naverMapWrapper';
import utils from '@/lib/utils';

/**
 * eventListenerMapMap에 등록된 eventListener를 호출합니다.
 *
 * @param {Map} eventListenerMapMap - eventListener를 이벤트별로 가지고 있는 맵객체
 * @param {string} key - eventListenerMap의 문자열 키
 * @param {object} payload - event 관련 정보
 *
 * @return {void} 반환값 없음
 */
const emit = ({
  eventListenerMapMap,
  key,
  payload,
}) => {
  if (!eventListenerMapMap.has(key)) {
    return;
  }
  const eventListenerMap = eventListenerMapMap.get(key);
  if (eventListenerMap.size > 0) {
    utils.convertMapToList(eventListenerMap).forEach((v) => v(payload));
  }
};

/**
 * eventListenerMapMap에 eventListener를 추가합니다.
 *
 * @param {Map} eventListenerMapMap - eventListener를 이벤트별로 가지고 있는 맵객체
 * @param {string} event - overlay event 이름
 * @param {function} listener - event가 트리거가 될때 호출되는 콜백함수
 * @param {string} id - listener를 가리키는 id
 *
 * @return {void} 반환값 없음
 */
const addEventListener = ({
  eventListenerMapMap,
  event,
  listener,
  id,
}) => {
  if (!eventListenerMapMap) {
    throw new Error(`eventListenerMapMap:${eventListenerMapMap} / 유효하지 않습니다.`);
  }
  if (!OVERLAY_EVENT_SET.has(event)) {
    throw new Error(`event:${event} / 유효하지 않습니다.`);
  }
  if (!listener) {
    throw new Error(`listener:${listener} / 유효하지 않습니다.`);
  }
  if (!id) {
    throw new Error(`id:${id} / 유효하지 않습니다.`);
  }
  if (eventListenerMapMap.has(event)) {
    eventListenerMapMap.get(event).set(id, listener);
  }
};

/**
 * eventListenerMapMap에 eventListener를 제거합니다.
 *
 * @param {Map} eventListenerMapMap - eventListener를 이벤트별로 가지고 있는 맵객체
 * @param {string} event - overlay event 이름
 * @param {string} id - listener를 가리키는 id
 *
 * @return {void} 반환값 없음
 */
const removeEventListener = ({
  eventListenerMapMap,
  event,
  id,
}) => {
  if (!eventListenerMapMap) {
    throw new Error(`eventListenerMapMap:${eventListenerMapMap} / 유효하지 않습니다.`);
  }
  if (!OVERLAY_EVENT_SET.has(event)) {
    throw new Error(`event:${event} / 유효하지 않습니다.`);
  }
  if (!id) {
    throw new Error(`id:${id} / 유효하지 않습니다.`);
  }
  if (eventListenerMapMap.has(event) && eventListenerMapMap.get(event).has(id)) {
    eventListenerMapMap.get(event).delete(id);
  }
};


/**
 * overlay 객체에 focus(mouseover) 이벤트가 발생했을 때, 처리해야할 일을 수행합니다.
 *
 * @param {string} status - 오버레이 객체의 상태
 * @param {Map} eventListenerMapMap - 이벤트 리스너의 맵의 맵
 * @param {object} payload - 이벤트 객체
 *
 * @return {void} 반환값 없음
 */
const focus = ({
  eventListenerMapMap,
  payload,
}) => {
  emit({
    eventListenerMapMap,
    key: OVERLAY_EVENT.FOCUS,
    payload,
  });
};

/**
 * overlay 객체에 blur(mouseout) 이벤트가 발생했을 때, 처리해야할 일을 수행합니다.
 *
 * @param {string} status - 오버레이 객체의 상태
 * @param {Map} eventListenerMapMap - 이벤트 리스너의 맵의 맵
 * @param {object} payload - 이벤트 객체
 *
 * @return {void} 반환값 없음
 */
const blur = ({
  eventListenerMapMap,
  payload,
}) => {
  emit({
    eventListenerMapMap,
    key: OVERLAY_EVENT.BLUR,
    payload,
  });
};

/**
 * overlay 객체에 click 이벤트가 발생했을 때, 처리해야할 일을 수행합니다.
 *
 * @param {Map} eventListenerMapMap - 이벤트 리스너의 맵의 맵
 * @param {object} payload - 이벤트 객체
 *
 * @return {void} 반환값 없음
 */
const click = ({
  eventListenerMapMap,
  payload,
}) => {
  emit({
    eventListenerMapMap,
    key: OVERLAY_EVENT.CLICK,
    payload,
  });
};

/**
 * overlay 객체에 rightclick 이벤트가 발생했을 때, 처리해야할 일을 수행합니다.
 *
 * @param {Map} eventListenerMapMap - 이벤트 리스너의 맵의 맵
 * @param {object} payload - 이벤트 객체
 *
 * @return {void} 반환값 없음
 */
const rightClick = ({
  eventListenerMapMap,
  payload,
}) => {
  emit({
    eventListenerMapMap,
    key: OVERLAY_EVENT.RIGHT_CLICK,
    payload,
  });
};

/**
 * overlay 객체에 mousemove 이벤트가 발생했을 때, 처리해야할 일을 수행합니다.
 *
 * @param {string} status - 오버레이 객체의 상태
 * @param {Map} eventListenerMapMap - 이벤트 리스너의 맵의 맵
 * @param {object} payload - 이벤트 객체
 *
 * @return {void} 반환값 없음
 */
const mousemove = ({
  eventListenerMapMap,
  payload,
}) => {
  emit({
    eventListenerMapMap,
    key: OVERLAY_EVENT.MOUSE_MOVE,
    payload,
  });
};

class HTMLElementEventController {
  #eventListenerMapMap

  #naverMapEventListeners

  #status

  #element

  #onFocus

  #onBlur

  #onClick

  #onRightClick

  #onMousemove

  #meta

  constructor({
    onFocus = () => ({}),
    onBlur = () => ({}),
    onClick = () => ({}),
    onRightClick = () => ({}),
    onMousemove = () => ({}),
    meta,
  }) {
    this.#onFocus = onFocus;
    this.#onBlur = onBlur;
    this.#onClick = onClick;
    this.#onRightClick = onRightClick;
    this.#onMousemove = onMousemove;
    this.#meta = meta;

    this.#naverMapEventListeners = [];

    this.#eventListenerMapMap = new Map();
    this.#eventListenerMapMap.set(OVERLAY_EVENT.BLUR, new Map());
    this.#eventListenerMapMap.set(OVERLAY_EVENT.FOCUS, new Map());
    this.#eventListenerMapMap.set(OVERLAY_EVENT.CLICK, new Map());
    this.#eventListenerMapMap.set(OVERLAY_EVENT.RIGHT_CLICK, new Map());
    this.#eventListenerMapMap.set(OVERLAY_EVENT.MOUSE_MOVE, new Map());
  }

  setElement(element) {
    if (!element) {
      throw new Error(`setElement/element:${element}/유효하지 않습니다.`);
    }

    this.#element = element;

    if (utils.isValidArray(this.#naverMapEventListeners)) {
      naverMapWrapper.removeListener(this.#naverMapEventListeners);
      this.#naverMapEventListeners = [];
    }

    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-UI-Event.html
    this.#naverMapEventListeners.push(naverMapWrapper.addDOMListener(this.#element, 'mouseover', (e) => {
      // TODO 이벤트 객체:e의 필요한 값만 골라서 받기
      const payload = {
        ...e, // @ deprecated
        meta: {
          ...this.#meta,
        },
      };
      this.#onFocus(payload);
      focus({
        eventListenerMapMap: this.#eventListenerMapMap,
        payload,
      });
      this.#status = OVERLAY_STATUS.FOCUS;
    }));
    this.#naverMapEventListeners.push(naverMapWrapper.addDOMListener(this.#element, 'mouseout', (e) => {
      // TODO 이벤트 객체:e의 필요한 값만 골라서 받기
      const payload = {
        ...e, // @ deprecated
        meta: {
          ...this.#meta,
        },
      };
      this.#onBlur(payload);
      blur({
        eventListenerMapMap: this.#eventListenerMapMap,
        payload,
      });
      this.#status = OVERLAY_STATUS.BLUR;
    }));
    this.#naverMapEventListeners.push(naverMapWrapper.addDOMListener(this.#element, 'mousemove', (e) => {
      // TODO 이벤트 객체:e의 필요한 값만 골라서 받기
      const payload = {
        ...e, // @ deprecated
        meta: {
          ...this.#meta,
        },
      };
      this.#onMousemove(payload);
      mousemove({
        eventListenerMapMap: this.#eventListenerMapMap,
        payload,
      });
    }));
    this.#naverMapEventListeners.push(naverMapWrapper.addDOMListener(this.#element, 'click', (e) => {
      // TODO 이벤트 객체:e의 필요한 값만 골라서 받기
      const payload = {
        ...e, // @ deprecated
        meta: {
          ...this.#meta,
        },
      };
      this.#onClick(payload);
      click({
        eventListenerMapMap: this.#eventListenerMapMap,
        payload,
      });
    }));
    this.#naverMapEventListeners.push(naverMapWrapper.addDOMListener(this.#element, 'rightclick', (e) => {
      // TODO 이벤트 객체:e의 필요한 값만 골라서 받기
      const payload = {
        ...e, // @ deprecated
        meta: {
          ...this.#meta,
        },
      };
      this.#onRightClick(payload);
      rightClick({
        eventListenerMapMap: this.#eventListenerMapMap,
        payload,
      });
    }));

    this.#status = OVERLAY_STATUS.BLUR;
  }

  /**
   * HTMLElementEventController를 삭제합니다.
   *
   * @return {void} 반환값 없음
   */
  remove() {
    if (this.#eventListenerMapMap) {
      if (this.#eventListenerMapMap.has(OVERLAY_EVENT.BLUR)) {
        this.#eventListenerMapMap.get(OVERLAY_EVENT.BLUR).clear();
      }
      if (this.#eventListenerMapMap.has(OVERLAY_EVENT.FOCUS)) {
        this.#eventListenerMapMap.get(OVERLAY_EVENT.FOCUS).clear();
      }
      if (this.#eventListenerMapMap.has(OVERLAY_EVENT.CLICK)) {
        this.#eventListenerMapMap.get(OVERLAY_EVENT.CLICK).clear();
      }
      if (this.#eventListenerMapMap.has(OVERLAY_EVENT.RIGHT_CLICK)) {
        this.#eventListenerMapMap.get(OVERLAY_EVENT.RIGHT_CLICK).clear();
      }
      if (this.#eventListenerMapMap.has(OVERLAY_EVENT.MOUSE_MOVE)) {
        this.#eventListenerMapMap.get(OVERLAY_EVENT.MOUSE_MOVE).clear();
      }
      this.#eventListenerMapMap.clear();
    }

    if (this.#naverMapEventListeners) {
      naverMapWrapper.removeDOMListener(this.#naverMapEventListeners);
    }

    this.#status = OVERLAY_STATUS.NO_STATUS;
  }

  /**
   * HTMLElementEventController의 객체를 완전히 삭제합니다.
   *
   * @return {void} 반환값 없음
   */
  destroy() {
    this.remove();
    this.#eventListenerMapMap = null;
    this.#naverMapEventListeners = null;
    this.#status = null;
  }

  /**
   * overlay 이벤트 상태:focus 여부를 알려줍니다.
   *
   * @return {boolean} overlay 이벤트 상태:focus 여부
   */
  isFocus() {
    return this.#status === OVERLAY_STATUS.FOCUS;
  }

  /**
   * overlay 이벤트 상태:blur 여부를 알려줍니다.
   *
   * @return {boolean} overlay 이벤트 상태:blur 여부
   */
  isBlur() {
    return this.#status === OVERLAY_STATUS.BLUR;
  }

  /**
   * overlay 객체에 focus 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - focus 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addFocusListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    const id = uuidv4();
    addEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.FOCUS,
      listener,
      id,
    });

    return id;
  }

  /**
   * overlay 객체에 focus 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeFocusListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    removeEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.FOCUS,
      id,
    });
  }

  /**
   * overlay 객체에 blur 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - blur 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addBlurListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    const id = uuidv4();
    addEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.BLUR,
      listener,
      id,
    });

    return id;
  }

  /**
   * overlay 객체에 blur 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeBlurListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    removeEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.BLUR,
      id,
    });
  }

  /**
   * overlay 객체에 click 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    const id = uuidv4();
    addEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.CLICK,
      listener,
      id,
    });

    return id;
  }

  /**
   * overlay 객체에 click 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeClickListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    removeEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.CLICK,
      id,
    });
  }


  /**
   * overlay 객체에 rightClick 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addRightClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    const id = uuidv4();
    addEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.RIGHT_CLICK,
      listener,
      id,
    });

    return id;
  }

  /**
   * overlay 객체에 rightClick 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeRightClickListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    removeEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.RIGHT_CLICK,
      id,
    });
  }

  /**
   * overlay 객체에 Mousemove 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - Mousemove 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addMousemoveListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    const id = uuidv4();
    addEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.MOUSE_MOVE,
      listener,
      id,
    });

    return id;
  }

  /**
   * overlay 객체에 Mousemove 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeMousemoveListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    removeEventListener({
      eventListenerMapMap: this.#eventListenerMapMap,
      event: OVERLAY_EVENT.MOUSE_MOVE,
      id,
    });
  }

  /**
   * overlay 객체의 상태값(FOCUS, BLUR)를 바꿉니다.
   * 자기자신이 아닌 다른 대상의 mouseover, mouseout의 이벤트와 연동하여 상태를 바꿀때 사용해야 합니다.
   *
   * @param {string} status - overlay 객체의 상태값(FOCUS, BLUR)
   *
   * @return {void} 반환값 없음
   */
  setStatus(status) {
    if (!OVERLAY_EVENT_SET.has(status)) {
      throw new Error(`status:${status}/유효하지 않습니다.`);
    }
    this.#status = status;
  }

  /**
   * overlay 이벤트 상태를 focus로 설정합니다.
   *
   * @return {void} 반환값 없음
   */
  setStatusFocus() {
    this.#status = OVERLAY_STATUS.FOCUS;
  }

  /**
   * overlay 이벤트 상태를 focus로 설정합니다.
   *
   * @return {void} 반환값 없음
   */
  setStatusBlur() {
    this.#status = OVERLAY_STATUS.BLUR;
  }
}

export default {
  /**
   * 네이버 오버레이 객체의 이벤트를 관리하는 HTMLElementEventController 객체를 만들어 줍니다.
   *
   * @param {function} onFocus - focus 이벤트 콜백
   * @param {function} onBlur - blur 이벤트 콜백
   * @param {function} onClick - click 이벤트 콜백
   * @param {function} onMousemove - mousemove 이벤트 콜백
   * @param {object} meta - 오버레이의 메타정보
   *
   * @return {HTMLElementEventController} HTMLElementEventController 인스턴스 반환
   */
  createHTMLElementEventController({
    onFocus,
    onBlur,
    onClick,
    onMousemove,
    meta,
  }) {
    return new HTMLElementEventController({
      onFocus,
      onBlur,
      onClick,
      onMousemove,
      meta,
    });
  },
};
