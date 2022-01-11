import moment from 'moment';
import {
  h3IsValid,
} from 'h3-js';
import {
  SERVICEUSER_APPROVE_STATUS_SET,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';

export { default as rules } from './rules';
export { default as ruleMap } from './ruleMap';

const YYYYMMDD = 'YYYY-MM-DD';

export default {
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
  convertObjToSet(obj) {
    if (!obj) {
      return new Set();
    }
    return this.convertListToSet(Object.values(obj));
  },
  convertListToSet(list) {
    if (!this.isValidArray(list)) {
      return new Set();
    }

    return list.reduce((acc, v) => {
      acc.add(v);
      return acc;
    }, new Set());
  },
  convertMapToList(map) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#relation_with_array_objects
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#cloning_and_merging_maps
    return Array.from(new Map(map).values());
  },
  // '2021-06-28'
  getNowYYYYMMDD() {
    return moment().format(YYYYMMDD);
  },
  getNowUTC() {
    return moment().utc().toISOString();
  },
  isBefore(yyyymmddA, yyyymmddB) {
    // moment('2010-10-20').isBefore('2010-10-21'); // true
    // https://momentjs.com/docs/#/query/is-before/
    return moment(yyyymmddA).isBefore(yyyymmddB);
  },
  isAfter(yyyymmddA, yyyymmddB) {
    // moment('2010-10-20').isAfter('2010-10-19'); // true
    // https://momentjs.com/docs/#/query/is-after/
    return moment(yyyymmddA).isAfter(yyyymmddB);
  },
  convertDateNHourToMoment(yyyymmdd, hour) {
    return moment(yyyymmdd).add(hour, 'h');
  },
  convertDateNHourToUTC(yyyymmdd, hour) {
    // https://momentjs.com/docs/#/manipulating/utc/
    // ex: "2020-10-09T00:00:00Z"
    return this.convertDateNHourToMoment(yyyymmdd, hour).utc().format();
  },
  convertYYYYMMDDStrToUTCTime(yyyymmdd) {
    return moment(yyyymmdd, 'YYYY-MM-DD').utc().toISOString();
  },
  convertUTCToLocalYYYYMMDD(utc) {
    // '2021-06-28T06:03:01.291Z' to '2021-06-28'
    return moment(utc).format(YYYYMMDD);
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
