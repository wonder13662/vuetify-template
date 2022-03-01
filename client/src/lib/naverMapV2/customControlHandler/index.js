import naverMapWrapper from '../lib/naverMapWrapper';
import customControlEventHandler from '../customControlEventHandler';

/*
 * 지도 위에 고정된 위치에 제공되는 버튼(CustomControl)
 *
 * 관련정보
 * https://navermaps.github.io/maps.js.ncp/docs/tutorial-4-control-custom-p1.example.html#
 * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.CustomControl.html
 *
*/

// 커스텀컨트롤 버튼 정의
// - overlay와 동일한 인터페이스를 가짐
// - setNaverMap을 구현함
// - overlay와 동일한 상태를 가짐 (focus, blur, selected, unselected, disabled, enabled)
// - 화면에 고정된 위치에서 사용자의 이벤트를 받음
// - 용도에 따라 버튼, 배너등으로 쓰일 수 있음. customControl을 합성해서 만든다.

// 영역선택기 정의
// - 영역선택기에는 세가지 모드가 있음 읽기(READ), 편집추가(EDIT_ADD), 편집삭제(EDIT_REMOVE)
// - 사용자는 각 모드에서 작업을 완료하고 다른 모드로 전환하기 전에 다이얼로그에서 완료버튼을 눌러 작업중인 내용을 "저장"해야 한다.

class CustomControl {
  #html

  #meta

  #naverCustomControl

  #customControlEventHandler

  #map

  constructor({
    html,
    meta,
  }) {
    this.#html = html;
    this.#meta = meta;
    this.#naverCustomControl = null;
    // createCustomControlEventController
    this.#customControlEventHandler = customControlEventHandler.createCustomControlEventController({
      onFocus: () => {
        // eslint-disable-next-line no-console
        console.log('onFocus');
      },
      onBlur: () => {
        // eslint-disable-next-line no-console
        console.log('onBlur');
      },
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('onClick');
      },
      meta: { ...this.#meta },
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

    this.#customControlEventHandler.setElement(this.#naverCustomControl.getElement());
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
    this.#customControlEventHandler.remove();
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
    this.#customControlEventHandler = null;
  }

  /**
   * Naver customControl에 click 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - click 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addClickListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    const id = this.#customControlEventHandler.addClickListener(listener);
    return id;
  }

  /**
   * Naver customControl에 click 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeClickListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    this.#customControlEventHandler.removeClickListener(id);
  }

  /**
   * Naver customControl에 focus 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - focus 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addFocusListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    const id = this.#customControlEventHandler.addFocusListener(listener);
    return id;
  }

  /**
   * Naver customControl에 focus 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeFocusListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    this.#customControlEventHandler.removeFocusListener(id);
  }

  /**
   * Naver customControl에 blur 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - blur 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addBlurListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    const id = this.#customControlEventHandler.addBlurListener(listener);
    return id;
  }

  /**
   * Naver customControl에 blur 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeBlurListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    this.#customControlEventHandler.removeBlurListener(id);
  }

  /**
   * Naver customControl에 mousemove 이벤트 리스너를 추가합니다.
   *
   * @param {function} listener - mousemove 이벤트 리스너
   *
   * @return {string} listener가 등록된 id
   */
  addMousemoveListener(listener) {
    if (!listener) {
      throw new Error('listener: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    const id = this.#customControlEventHandler.addMousemoveListener(listener);
    return id;
  }

  /**
   * Naver customControl에 mousemove 이벤트 리스너를 제거합니다.
   *
   * @param {string} id - listener가 등록된 id
   *
   * @return {void} 반환값 없음
   */
  removeMousemoveListener(id) {
    if (!id) {
      throw new Error('id: 유효하지 않음');
    }
    if (!this.#customControlEventHandler) {
      throw new Error('this.#customControlEventHandler/유효하지 않습니다.');
    }

    this.#customControlEventHandler.removeMousemoveListener(id);
  }
}

export default {
  // TODO 이벤트 리스너 콜백들을 인자로 받기
  createCustomControl({
    html,
    meta = {},
  }) {
    return new CustomControl({
      html,
      meta,
    });
  },
};
