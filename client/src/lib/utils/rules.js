import i18n from '@/plugins/vueI18n';

// https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
const rulePassword = {
  required: {
    rule: (v) => !!v,
    message: i18n.t('common.error.password.required'),
  },
  // mustContainAtLeast1LowercaseAlphabet: {
  //   rule: (v) => /(?=.*[a-z])/.test(v),
  //   message: i18n.t('common.error.password.mustContainAtLeast1LowercaseAlphabet'),
  // },
  // mustContainAtLeast1UppercaseAlphabet: {
  //   rule: (v) => /(?=.*[A-Z])/.test(v),
  //   message: i18n.t('common.error.password.mustContainAtLeast1UppercaseAlphabet'),
  // },
  // mustContainAtLeast1Number: {
  //   rule: (v) => /(?=.*[0-9])/.test(v),
  //   message: i18n.t('common.error.password.mustContainAtLeast1Number'),
  // },
  // mustContainAtLeast1SpecialCharacter: {
  //   rule: (v) => /(?=.*[!@#$%^&*])/.test(v),
  //   message: i18n.t('common.error.password.mustContainAtLeast1SpecialCharacter'),
  // },
  mustGreaterThanOrEqual8Letters: {
    rule: (v) => /(?=.{8,})/.test(v),
    message: i18n.t('common.error.password.mustGreaterThanOrEqual8Letters'),
  },
};

// https://www.w3resource.com/javascript/form/email-validation.php
const ruleEmail = {
  required: {
    rule: (v) => !!v,
    message: i18n.t('common.error.email.required'),
  },
  email: {
    rule: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i.test(v),
    message: i18n.t('common.error.email.notValidFormat'),
  },
};

const convertRuleMapToRules = (ruleMap) => {
  const values = Object.values(ruleMap);
  return values.map(({ rule, message }) => ((v) => rule(v) || message));
};

const checkRules = (ruleMap, v) => Object.values(ruleMap).find(({ rule }) => !rule(v));

export default {
  getRuleEmail: () => convertRuleMapToRules(ruleEmail),
  isValidEmail: (arg) => !checkRules(ruleEmail, arg),
  getRulePassword: () => convertRuleMapToRules(rulePassword),
  isValidPassword: (arg) => !checkRules(rulePassword, arg),
};
