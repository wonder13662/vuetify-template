import moment from 'moment';
import {
  h3IsValid,
} from 'h3-js';
import {
  SERVICEUSER_APPROVE_STATUS_SET,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';

const directorGroupNameRuleMap = {
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
};

const convertRuleMapToRules = (ruleMap) => {
  const values = Object.values(ruleMap);
  return values.map(({ rule, message }) => ((v) => rule(v) || message));
};

const checkRules = (ruleMap, v) => Object.values(ruleMap).find(({ rule }) => !rule(v));

export default {
  getDirectorGroupNameRules() {
    return convertRuleMapToRules(directorGroupNameRuleMap);
  },
  isValidDirectorGroupName(name) {
    const found = checkRules(directorGroupNameRuleMap, name);
    return !found;
  },
  isValidArray(v, minLength = 0) {
    return v && v.length > minLength;
  },
  isValidH3(v) {
    // https://h3geo.org/docs/api/inspection#h3isvalid
    return h3IsValid(v);
  },
  isUUIDType(id) {
    // https://www.postgresql.org/docs/9.1/datatype-uuid.html
    // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
    const rule = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return rule.test(id);
  },
  isValidPhoneNumber(phoneNumber) {
    // https://luerangler-dev.tistory.com/41
    const rule = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return rule.test(phoneNumber);
  },
  isValidEmail(email) {
    // https://www.w3resource.com/javascript/form/email-validation.php
    const rule = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i;
    return rule.test(email);
  },
  isBoolean(v) {
    return typeof v === 'boolean';
  },
  isValidString(v, minLength = 0) {
    return typeof v === 'string' && v.length > minLength;
  },
  isPositiveInteger(v) {
    const safeNumber = Number(v);
    return Number.isInteger(safeNumber) && safeNumber > 0;
  },
  isUnsignedInteger(v) {
    const safeNumber = Number(v);
    return Number.isInteger(safeNumber) && safeNumber >= 0;
  },
  isLatitude(v) {
    return Number.isFinite(v) && v >= -90 && v <= 90;
  },
  isLongitude(v) {
    return Number.isFinite(v) && v >= -180 && v <= 180;
  },
  // '2021-06-28T06:03:01.291Z' to '2021-06-28 06:03:01'
  convertUnixTimeToReadable(unixTime) {
    return moment(unixTime).format('YYYY-MM-DD HH:mm:ss');
  },
  convertTimeToReadable(time) {
    const timeSafe = (typeof time !== 'string') ? Number(time) : time;
    const timeReadable = this.convertUnixTimeToReadable(timeSafe);
    const momentTime = moment(timeSafe);
    const durationLeftInMinutes = moment.duration(momentTime.diff(moment())).minutes();
    return {
      timeReadable,
      durationLeftInMinutes,
    };
  },
  convertDeliveryIdShortReadable(deliveryId) {
    if (!deliveryId) return '';
    return deliveryId.slice(0, 8).toUpperCase();
  },
  convertServiceUserApproveStatusReadable(approveStatus) {
    if (!approveStatus || !SERVICEUSER_APPROVE_STATUS_SET.has(approveStatus)) {
      throw new Error(`approveStatus: ${i18n.t('common.error.notValid')}`);
    }
    return i18n.t(`models.serviceUser.approveStatus.${approveStatus}`);
  },
};
