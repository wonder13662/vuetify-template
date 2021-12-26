import Vue from 'vue';
import VueI18n from 'vue-i18n';

import { ko, en } from '@/lib/locales';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'ko', // set locale
  messages: { ko, en }, // set locale messages
});

export default i18n;
