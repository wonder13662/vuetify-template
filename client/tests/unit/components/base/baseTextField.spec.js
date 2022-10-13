import Vuex from 'vuex'
import Vuetify from 'vuetify';
import { 
  createLocalVue,
  mount,
} from '@vue/test-utils';
import flushPromises from 'flush-promises';
// import { setupI18n } from './i18n';

import BaseTextFieldSandBox from './BaseTextFieldSandBox';

const localVue = createLocalVue();
localVue.use(Vuex);
// const i18n = setupI18n(localVue);

const findComponentBaseTextField = (wrapper) => wrapper.findComponent('#test-base-text-field');
const findVueInstanceVTextField = (wrapper) => {
  const baseTextField = findComponentBaseTextField(wrapper);
  const vTextField = baseTextField.vm.$children[0];
  return vTextField;
}

describe('#1 사용자가 입력한 값이 표시되어야 한다', () => {
  let vuetify;
  let wrapper;
  let target;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(BaseTextFieldSandBox, {
      localVue,
      vuetify,
      // i18n,
    });
  });

  afterEach(async () => {    
    vuetify = null;
    wrapper = null;
    target = null;
  });

  test('#1-1 SandBox에서 설정한 값이 BaseTextField에 표시되어야 한다', async () => {
    // 1. [CHECK] SandBox와 BaseTextField가 마운트되어야 한다.
    expect(wrapper.exists()).toBeTruthy();
    const baseTextField = findComponentBaseTextField(wrapper);
    expect(baseTextField.exists()).toBeTruthy();
    const vTextField = findVueInstanceVTextField(wrapper);
    // FIXME vueTestUtil에서 사용하는 Component 객체로 감쌀수 있나? 그래야 동일한 API를 사용해서 검사할 수 있다.
    // 2. [CHECK] label
    expect(wrapper.vm.label).toBe(baseTextField.props().label);
    expect(wrapper.vm.label).toBe(vTextField.$props.label);
    // 3. [CHECK] value
    expect(wrapper.vm.value).toBe(baseTextField.props().value);
    expect(wrapper.vm.value).toBe(vTextField.$props.value);
  });
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