import Vuex from 'vuex'
import Vuetify from 'vuetify';
import { 
  createLocalVue,
  mount,
} from '@vue/test-utils';
import flushPromises from 'flush-promises';
import {
  RULE_KEY,
} from '@/lib/constants';
import ruleMap from '@/lib/ruleMap';

import BaseTextFieldSandBox from './BaseTextFieldSandBox';
import { _ } from 'core-js';

const localVue = createLocalVue();
localVue.use(Vuex);

const findComponentBaseTextField = (wrapper) => wrapper.findComponent('#test-base-text-field');
const findVueInstanceVTextField = (wrapper) => {
  const baseTextField = findComponentBaseTextField(wrapper);
  const vTextField = baseTextField.vm.$children[0];
  return vTextField;
}
const checkRules = (v) => {
  return ruleMap.isValid(RULE_KEY.PERSON_NAME, v);
};

describe('#1 사용자가 입력한 값이 표시되어야 한다', () => {
  let vuetify;
  let wrapper;
  let expected;
  let notValidValue;
  let validValue;
  let baseTextField;
  let vTextField;
  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(BaseTextFieldSandBox, {
      localVue,
      vuetify,
    });
    expect(wrapper.exists()).toBeTruthy();
    baseTextField = findComponentBaseTextField(wrapper);
    expect(baseTextField.exists()).toBeTruthy();
    vTextField = findVueInstanceVTextField(wrapper);
    await flushPromises();
  });

  afterEach(async () => {    
    vuetify = null;
    wrapper = null;
    expected = null;
    notValidValue = null;
    validValue = null;
    baseTextField = null;
    vTextField = null;
  });

  // FIXME vueTestUtil에서 사용하는 Component 객체로 감쌀수 있나? 그래야 동일한 API를 사용해서 검사할 수 있다.

  test('#1-1 props 값 전달 검사', async () => {
    // 0. [CHECK] SandBox와 BaseTextField가 마운트되어야 한다.
    expect(wrapper.exists()).toBeTruthy();
    baseTextField = findComponentBaseTextField(wrapper);
    expect(baseTextField.exists()).toBeTruthy();
    vTextField = findVueInstanceVTextField(wrapper);
    // 1. props 값 전달 검사
    // 1-1. [CHECK] label
    expect(wrapper.vm.label).toBe(baseTextField.props().label);
    expect(wrapper.vm.label).toBe(vTextField.$props.label);
    // 1-2. [CHECK] value
    expect(wrapper.vm.value).toBe(baseTextField.props().value);
    expect(wrapper.vm.value).toBe(vTextField.$props.value);
    // 1-3. [CHECK] disabled
    expect(wrapper.vm.disabled).toBe(baseTextField.props().disabled);
    expect(wrapper.vm.disabled).toBe(vTextField.$props.disabled);
    // 1-4. [CHECK] vTextField의 상태가 유효해야 합니다.
    expect(vTextField.$data.valid).toBeTruthy();
  }); 

  test('#1-2 Rules 검사', async () => {
    // 1. [EVENT] 사용자가 유효하지 않은 값을 입력합니다.(required)
    notValidValue = null;
    expected = checkRules(notValidValue);
    expect(expected).toBeFalsy();
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 2. [CHECK] 유효하지 않은 값을 입력했으므로 valid가 false
    expect(vTextField.$data.valid).toBe(expected);
    // 3. [EVENT] 사용자가 1글자를 입력합니다.(mustGreaterThanOrEqual2Letters)
    notValidValue = '1';
    expected = checkRules(notValidValue);
    expect(expected).toBeFalsy();
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 4. [CHECK] 유효하지 않은 값을 입력했으므로 valid가 false
    expect(vTextField.$data.valid).toBe(expected);
    // 5. [EVENT] 사용자가 11글자를 입력합니다.(mustLessThanOrEqual10Letters)
    notValidValue = '12345678901';
    expected = checkRules(notValidValue);
    expect(expected).toBeFalsy();
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 6. [CHECK] 유효하지 않은 값을 입력했으므로 valid가 false
    expect(vTextField.$data.valid).toBe(expected);
    // 7. [EVENT] 사용자가 10글자를 입력합니다.(유효함)
    validValue = '1234567890';
    expected = checkRules(validValue);
    expect(expected).toBeTruthy();
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 8. [CHECK] 유효한 값을 입력했으므로 valid가 true
    expect(vTextField.$data.valid).toBe(expected);
  });

  test('#1-3 Event 검사', async () => {
    // 1. [EVENT] 사용자가 값을 입력. 이벤트는 input
    expected = '1234567890';
    vTextField.$emit('input', expected);
    await flushPromises();
    // 2. [CHECK] 사용자가 입력한 값이 container에 등록되어야 한다.
    expect(wrapper.vm.value).toBe(expected);
    expect(baseTextField.props().value).toBe(expected);
    expect(vTextField.$props.value).toBe(expected);
    // 3. [EVENT] 사용자가 값을 입력. 이벤트는 change
    expected = '12345';
    vTextField.$emit('change', expected);
    await flushPromises();
    // 4. [CHECK] 사용자가 입력한 값이 container에 등록되어야 한다.
    expect(wrapper.vm.value).toBe(expected);
    expect(baseTextField.props().value).toBe(expected);
    expect(vTextField.$props.value).toBe(expected);
  });
});

describe('#2 typeNumber', () => {
  let vuetify;
  let wrapper;
  let expected;
  let notValidValue;
  let validValue;
  let baseTextField;
  let vTextField;
  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(BaseTextFieldSandBox, {
      localVue,
      vuetify,
      // TODO data.typeNumber 속성을 정의해야 함
    });
    wrapper.setData({
      label: '금액',
      // hideDetails: true, // REMOVE ME 사용하는 곳 없음. 확인 뒤 삭제 필요
      value: 1000,
      rules: [],
      typeNumber: true,
    });
    expect(wrapper.exists()).toBeTruthy();
    baseTextField = findComponentBaseTextField(wrapper);
    expect(baseTextField.exists()).toBeTruthy();
    vTextField = findVueInstanceVTextField(wrapper);
    await flushPromises();
  });

  afterEach(async () => {    
    vuetify = null;
    wrapper = null;
    expected = null;
    notValidValue = null;
    validValue = null;
    baseTextField = null;
    vTextField = null;
  });

  test('#2-1 props 값 전달 검사', async () => {
    // 1. [CHECK] label
    expect(wrapper.vm.label).toBe(baseTextField.props().label);
    expect(wrapper.vm.label).toBe(vTextField.$props.label);
    // 2. [CHECK] value
    expect(wrapper.vm.value).toBe(baseTextField.props().value);
    expect(wrapper.vm.value).toBe(vTextField.$props.value);
    // 3. [CHECK] disabled
    expect(wrapper.vm.disabled).toBe(baseTextField.props().disabled);
    expect(wrapper.vm.disabled).toBe(vTextField.$props.disabled);
    // 4. [CHECK] typeNumber
    expect(wrapper.vm.typeNumber).toBe(baseTextField.props().typeNumber);
    expect(vTextField.$props.type).toBe('number');
  });

  test('#2-2 숫자 이외의 값을 입력하면 무시', async () => {
    // 1-1. [EVENT] 사용자가 유효하지 않은 값(문자)을 입력합니다.
    notValidValue = 'notValidValue';
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 1-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 2-1. [EVENT] 사용자가 유효하지 않은 값(null)을 입력합니다.
    notValidValue = null;
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 2-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 3-1. [EVENT] 사용자가 유효하지 않은 값(null)을 입력합니다.
    notValidValue = undefined;
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 3-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 4-1. [EVENT] 사용자가 유효하지 않은 값({})을 입력합니다.
    notValidValue = {};
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 4-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 5-1. [EVENT] 사용자가 유효하지 않은 값([])을 입력합니다.
    notValidValue = [];
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 5-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 6-1. [EVENT] 사용자가 유효하지 않은 값(Symbol)을 입력합니다.
    notValidValue = Symbol();
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 6-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 7-1. [EVENT] 사용자가 유효하지 않은 값(NaN)을 입력합니다.
    notValidValue = NaN;
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 7-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 8-1. [EVENT] 사용자가 유효하지 않은 값(Infinity)을 입력합니다.
    notValidValue = Infinity;
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 8-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);
    // 9-1. [EVENT] 사용자가 유효하지 않은 값(-Infinity)을 입력합니다.
    notValidValue = -Infinity;
    vTextField.$emit('change', {notValidValue});
    await flushPromises();
    // 9-2. [CHECK] 사용자가 입력한 값이 표시되지 않아야 합니다.
    expect(wrapper.vm.value).not.toBe(notValidValue);
    expect(baseTextField.props().value).not.toBe(notValidValue);
    expect(vTextField.$props.value).not.toBe(notValidValue);    
  });

  test('#2-3 숫자를 입력하면 표시되어야 한다.', async () => {
    // 1-1. [EVENT] 사용자가 유효한 값(Positive Integer:1)을 입력합니다.
    validValue = 1;
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 1-2. [CHECK] 사용자가 입력한 값이 표시되어야 합니다.
    expect(wrapper.vm.value).toBe(validValue);
    expect(baseTextField.props().value).toBe(validValue);
    expect(vTextField.$props.value).toBe(validValue);
    // 2-1. [EVENT] 사용자가 유효한 값(0)을 입력합니다.
    validValue = 0;
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 2-2. [CHECK] 사용자가 입력한 값이 표시되어야 합니다.
    expect(wrapper.vm.value).toBe(validValue);
    expect(baseTextField.props().value).toBe(validValue);
    expect(vTextField.$props.value).toBe(validValue);    
    // 3-1. [EVENT] 사용자가 유효한 값(Negative Integer: -1)을 입력합니다.
    validValue = -1;
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 3-2. [CHECK] 사용자가 입력한 값이 표시되어야 합니다.
    expect(wrapper.vm.value).toBe(validValue);
    expect(baseTextField.props().value).toBe(validValue);
    expect(vTextField.$props.value).toBe(validValue);
    // 4-1. [EVENT] 사용자가 유효한 값(Positive flaot:1.1)을 입력합니다.
    validValue = 1.1;
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 4-2. [CHECK] 사용자가 입력한 값이 표시되어야 합니다.
    expect(wrapper.vm.value).toBe(validValue);
    expect(baseTextField.props().value).toBe(validValue);
    expect(vTextField.$props.value).toBe(validValue);
    // 5-1. [EVENT] 사용자가 유효한 값(Negative flaot:1.1)을 입력합니다.
    validValue = -1.1;
    vTextField.$emit('change', validValue);
    await flushPromises();
    // 5-2. [CHECK] 사용자가 입력한 값이 표시되어야 합니다.
    expect(wrapper.vm.value).toBe(validValue);
    expect(baseTextField.props().value).toBe(validValue);
    expect(vTextField.$props.value).toBe(validValue);
  });
});

describe('#3 typeEmail', () => {
  let vuetify;
  let wrapper;
  let expected;
  let notValidValue;
  let validValue;
  let baseTextField;
  let vTextField;
  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(BaseTextFieldSandBox, {
      localVue,
      vuetify,
      // TODO data.typeNumber 속성을 정의해야 함
    });
    wrapper.setData({
      label: '이메일',
      // hideDetails: true, // REMOVE ME 사용하는 곳 없음. 확인 뒤 삭제 필요
      value: 'wonder13662@gmail.com',
      rules: [],
      typeEmail: true,
    });
    expect(wrapper.exists()).toBeTruthy();
    baseTextField = findComponentBaseTextField(wrapper);
    expect(baseTextField.exists()).toBeTruthy();
    vTextField = findVueInstanceVTextField(wrapper);
    await flushPromises();
  });

  afterEach(async () => {    
    vuetify = null;
    wrapper = null;
    expected = null;
    notValidValue = null;
    validValue = null;
    baseTextField = null;
    vTextField = null;
  });

  test('#3-1 props 값 전달 검사', async () => {
    // 1. [CHECK] label
    expect(wrapper.vm.label).toBe(baseTextField.props().label);
    expect(wrapper.vm.label).toBe(vTextField.$props.label);
    // 2. [CHECK] value
    expect(wrapper.vm.value).toBe(baseTextField.props().value);
    expect(wrapper.vm.value).toBe(vTextField.$props.value);
    // 3. [CHECK] disabled
    expect(wrapper.vm.disabled).toBe(baseTextField.props().disabled);
    expect(wrapper.vm.disabled).toBe(vTextField.$props.disabled);
    // 4. [CHECK] typeNumber
    expect(wrapper.vm.typeNumber).toBe(baseTextField.props().typeNumber);
    expect(vTextField.$props.type).toBe('email');
  });

  test('#3-2 이메일 이외의 값을 입력하면 경고메시지 노출', async () => {
    // 1-1. [EVENT] 사용자가 유효하지 않은 값(문자)을 입력합니다.
    notValidValue = 1234;
    vTextField.$emit('change', notValidValue);
    await flushPromises();
    // 1-2. [CHECK] 사용자가 입력한 값이 유효하지 않아도 표시됩니다.
    console.log('wrapper.vm.value:', wrapper.vm.value);
    console.log('notValidValue:', notValidValue);
    expect(wrapper.vm.value).toBe(notValidValue);
    expect(baseTextField.props().value).toBe(notValidValue);
    expect(vTextField.$props.value).toBe(notValidValue);
    // 1-3. [CHECK] 입력한 값이 유효하지 않다는 경고 메시지가 노출됩니다.
    console.log('1/wrapper.vm.hasError:', wrapper.vm.hasError);
    // expect(wrapper.vm.hasError).toBeTruthy();
    // 1-4. [EVENT] 사용자가 유효한 값(문자)을 입력합니다.
    validValue = 'wonder13662@gmail.com';
    vTextField.$emit('change', validValue);
    await flushPromises();
    console.log('2/wrapper.vm.hasError:', wrapper.vm.hasError);

    // TODO validation을 가져오는 방법은?
    // TODO v-text-field의 내부 속성을 이용해 검사? 
    // Api 문서에 공개된 인터페이스로만 제어하는 것이 나을 것 같은데?
    // TODO 컴포넌트의 Sandbox 구조가 필요하다
    // TODO Vue2에서 Dynamic component를 사용하는 방법은?
  });
// 1. input
// 1-1. email
// 1-1-1. 대문자를 입력 시 소문자로 보여져야 합니다.
// 1-1-2. 공백이 입력되면 안됩니다.
});

describe('#4 typePassword', () => {
// 1-2. password
// 1-2-1. 최초 눈가린 아이콘이 보여져야 하고, 입력한 텍스트가 '*'로 보여져야 합니다.
// 1-2-2. 눈가린 아이콘 클릭 시 눈 아이콘으로 바뀐 뒤, 입력한 텍스트가 문자로 보여져야 합니다. 
// 1-2-3. 눈 아이콘을 클릭 시 눈가린 아이콘으로 바뀐 뒤, 입력한 텍스트가 '*'로 보여져야 합니다.
// 1-2-4. 공백이 입력되면 안됩니다.
});

describe('#5 counter', () => {
// 1. 지정한 counter 갯수 이상으로 입력하면 무시해야 합니다. 에러 메시지가 출력되어야 합니다.
// FIX ME rules로 제어하면 될 것 같다. 삭제해도 되지 않을까?
});

// BaseTextField의 수동 테스트 가이드
// 0. General
// 0-1. value에 새로운 값을 전달하면 바로 반영되어야 한다
// 0-1-1. (문제)onInput 시점과 onChange 시점에 받은 값의 유효성을 검사해 유효하지 않은 경우, 유효한 값으로 변경해 value에 전달하면 반영되지 않는 문제가 있음
// 1. typeNumber
// 1-1. typeNumber이면, 숫자(음수,0,정수) 이외의 문자는 입력할 수 없다

// 수동 테스트 목록
// 1. input
// 1-1. email
// 1-1-1. 대문자를 입력 시 소문자로 보여져야 합니다.
// 1-1-2. 공백이 입력되면 안됩니다.
// 1-2. password
// 1-2-1. 최초 눈가린 아이콘이 보여져야 하고, 입력한 텍스트가 '*'로 보여져야 합니다.
// 1-2-2. 눈가린 아이콘 클릭 시 눈 아이콘으로 바뀐 뒤, 입력한 텍스트가 문자로 보여져야 합니다. 
// 1-2-3. 눈 아이콘을 클릭 시 눈가린 아이콘으로 바뀐 뒤, 입력한 텍스트가 '*'로 보여져야 합니다.
// 1-2-4. 공백이 입력되면 안됩니다.