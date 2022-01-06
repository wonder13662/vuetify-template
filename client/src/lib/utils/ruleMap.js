import {
  RULE_KEY_SET,
  RULE_KEY,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';

const convertRuleMapToRules = (ruleMap) => {
  const values = Object.values(ruleMap);
  return values.map(({ rule, message }) => ((v) => rule(v) || message));
};

const checkRules = (ruleMap, v) => !Object.values(ruleMap).find(({ rule }) => !rule(v));

const RULE_MAP = {
  // https://luerangler-dev.tistory.com/41
  [RULE_KEY.PHONE_NUMBER]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.phoneNumber.required'),
    },
    phoneNumber: {
      rule: (v) => /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/.test(v),
      message: i18n.t('common.error.phoneNumber.notValidFormat'),
    },
  },
  // https://stackoverflow.com/questions/30485/what-is-a-reasonable-length-limit-on-person-name-fields
  // 영어 이름 기준으로 70자까지 허용이지만, 대한민국 이름 길이는 10글자로 우선 지정
  [RULE_KEY.PERSON_NAME]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.personName.required'),
    },
    mustGreaterThanOrEqual2Letters: {
      rule: (v) => v.length >= 2,
      message: i18n.t('common.error.personName.mustGreaterThanOrEqual2Letters'),
    },
    mustLessThanOrEqual10Letters: {
      rule: (v) => v.length <= 10,
      message: i18n.t('common.error.personName.mustLessThanOrEqual10Letters'),
    },
  },
  // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
  [RULE_KEY.PASSWORD_WEAK]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.password.required'),
    },
    mustGreaterThanOrEqual8Letters: {
      rule: (v) => /(?=.{8,})/.test(v),
      message: i18n.t('common.error.password.mustGreaterThanOrEqual8Letters'),
    },
  },
  [RULE_KEY.PASSWORD_STRONG]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.password.required'),
    },
    mustContainAtLeast1LowercaseAlphabet: {
      rule: (v) => /(?=.*[a-z])/.test(v),
      message: i18n.t('common.error.password.mustContainAtLeast1LowercaseAlphabet'),
    },
    mustContainAtLeast1UppercaseAlphabet: {
      rule: (v) => /(?=.*[A-Z])/.test(v),
      message: i18n.t('common.error.password.mustContainAtLeast1UppercaseAlphabet'),
    },
    mustContainAtLeast1Number: {
      rule: (v) => /(?=.*[0-9])/.test(v),
      message: i18n.t('common.error.password.mustContainAtLeast1Number'),
    },
    mustContainAtLeast1SpecialCharacter: {
      rule: (v) => /(?=.*[!@#$%^&*])/.test(v),
      message: i18n.t('common.error.password.mustContainAtLeast1SpecialCharacter'),
    },
    mustGreaterThanOrEqual8Letters: {
      rule: (v) => /(?=.{8,})/.test(v),
      message: i18n.t('common.error.password.mustGreaterThanOrEqual8Letters'),
    },
  },
  // https://www.w3resource.com/javascript/form/email-validation.php
  [RULE_KEY.EMAIL]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.email.required'),
    },
    email: {
      rule: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i.test(v),
      message: i18n.t('common.error.email.notValidFormat'),
    },
  },
  [RULE_KEY.DIRECTOR_GROUP_NAME]: {
    required: {
      rule: (v) => !!v,
      message: i18n.t('common.error.directorGroupList.required'),
    },
    mustGreaterThanOrEqual2Letters: {
      rule: (v) => v && v.length >= 2,
      message: i18n.t('common.error.directorGroupList.mustGreaterThanOrEqual2Letters'),
    },
    mustLessThanOrEqual10Letters: {
      rule: (v) => v && v.length <= 10,
      message: i18n.t('common.error.directorGroupList.mustLessThanOrEqual10Letters'),
    },
  },
};

export default {
  isValid(type, v) {
    if (!RULE_KEY_SET.has(type)) {
      throw new Error(`type:${type} / ${i18n.t('common.error.notValid')}`);
    }
    const ruleMap = RULE_MAP[type];
    if (!ruleMap) {
      throw new Error(`type:${type} / ruleMap / ${i18n.t('common.error.notValid')}`);
    }

    return checkRules(ruleMap, v);
  },
  getRule(type) {
    if (!RULE_KEY_SET.has(type)) {
      throw new Error(`type:${type} / ${i18n.t('common.error.notValid')}`);
    }
    const ruleMap = RULE_MAP[type];
    if (!ruleMap) {
      throw new Error(`type:${type} / ruleMap / ${i18n.t('common.error.notValid')}`);
    }

    return convertRuleMapToRules(ruleMap);
  },
};
