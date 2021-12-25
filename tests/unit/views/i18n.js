// https://github.com/kazupon/vue-i18n/issues/323#issuecomment-463228178
import VueI18n from 'vue-i18n';

import { ko, en } from '@/lib/locales';

const setupI18n = (vueInstance) => {
  vueInstance.use(VueI18n);

  return new VueI18n({
    locale: 'ko',
    messages: { ko, en },
  });
};

export {
  // eslint-disable-next-line import/prefer-default-export
  setupI18n,
};