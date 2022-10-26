import Vuex from 'vuex'
import Vuetify from 'vuetify';
import {
  createLocalVue,
  mount,
} from '@vue/test-utils';
import { setupI18n } from '../../../i18n';
import testUtils from '../../../utils';

import BaseSubmitBtn from '@/components/base/BaseSubmitBtn';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('#1 [Component]BaseSubmitBtn Mount', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });

  test('#1-1 mount', async () => {
    const wrapper = mount(BaseSubmitBtn, {
      localVue,
      vuetify,
      i18n,
    });
    expect(wrapper).toBeTruthy();
  });

  test('#1-2 props', async () => {
    // TODO 컴포넌트 생성시 props를 전달
    // TODO 컴포넌트 마운트 이후, text, disabled 정보 반영되는지 확인
  });

  test('#1-3 event', async () => {
    // TODO click 이벤트를 발생시켜서 부모 컴포넌트에서 emit한 이벤트를 받을 수 있어야 한다(부모 컴포넌트를 쓰지않고 해결할 방법찾기)
    // TODO props가 disabled이면, click 이벤트가 발생해도 이벤트를 받을 수 없어야 한다
  });
});