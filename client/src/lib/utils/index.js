import moment from 'moment';
import lodash from 'lodash';
import {
  h3IsValid,
} from 'h3-js';

const YYYYMMDD = 'YYYY-MM-DD';
const YYYYMMDDHHmmss = 'YYYY-MM-DD HH:mm:ss';
const HHmmss = 'HH:mm:ss';

export default {
  isUUIDType(id) {
    // https://www.postgresql.org/docs/9.1/datatype-uuid.html
    // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
    const rule = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return rule.test(id);
  },
  isValidArray(v, minLength = 1) {
    return v && typeof v === 'object' && v.length >= minLength;
  },
  isValidH3(v) { // REMOVE ME
    // https://h3geo.org/docs/api/inspection#h3isvalid
    return h3IsValid(v);
  },
  isValidPhoneNumber(phoneNumber) { // REMOVE ME
    // https://luerangler-dev.tistory.com/41
    const rule = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return rule.test(phoneNumber);
  },
  isValidEmail(email) { // REMOVE ME
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
  castStringToBoolean(v) {
    if (!this.isValidString(v)) {
      return null;
    }
    const safeLowerCase = v.toLowerCase();
    if (safeLowerCase === 'true') {
      return true;
    }
    if (safeLowerCase === 'false') {
      return false;
    }
    return null;
  },
  isLatitude(v) { // REMOVE ME
    return Number.isFinite(v) && v >= -90 && v <= 90;
  },
  isLongitude(v) { // REMOVE ME
    return Number.isFinite(v) && v >= -180 && v <= 180;
  },
  convertObjToSet(obj) {
    if (!obj || typeof obj !== 'object') {
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
  convertSetToList(aSet) {
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set
    if (!aSet
        || typeof aSet !== 'object'
        || aSet.add === undefined
        || aSet.size === undefined
        || aSet.size === 0) {
      return [];
    }
    return Array.from(aSet);
  },
  convertMapToList(aMap) {
    if (!aMap
        || typeof aMap !== 'object'
        || aMap.set === undefined
        || aMap.size === undefined
        || aMap.size === 0) {
      return [];
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#relation_with_array_objects
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#cloning_and_merging_maps
    return Array.from(new Map(aMap).values());
  },
  convertMapKeysToList(map) {
    return Array.from(new Map(map).keys());
  },
  // @ deprecated
  convertObjKeysToList(obj) {
    return Array.from(Object.keys(obj));
  },
  convertObjValuesToList(obj) {
    if (!obj
      || typeof obj !== 'object') {
      return [];
    }
    return Array.from(Object.values(obj));
  },
  // '2021-06-28'
  getNowYYYYMMDD() {
    return moment().format(YYYYMMDD);
  },
  getNowUTC() {
    return moment().utc().toISOString();
  },
  isSameOrBefore(yyyymmddA, yyyymmddB) {
    // moment('2010-10-20').isSameOrBefore('2010-10-20'); // true
    // moment('2010-10-20').isSameOrBefore('2010-10-21'); // true
    // https://momentjs.com/docs/#/query/is-same-or-before/
    return moment(yyyymmddA).isSameOrBefore(yyyymmddB);
  },
  /**
   * 오늘 날짜를 기준으로 정수형인 일수를 더합니다.
   * YYYY-MM-DD 포맷의 문자열로 결과를 돌려줍니다.
   *
   * @param {number} daysToSubtract - 오늘 날짜를 기준으로 더할 일수
   *
   * @return {string} YYYY-MM-DD 포맷의 문자열 ex) 2010-10-21
   */
  getLocalYYYYMMDDByAddDaysFromNow(daysToAdd) {
    return moment().add(daysToAdd, 'days').format(YYYYMMDD);
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
  convertYYYYMMDDStrToUTCStartOfTime(yyyymmdd) {
    // https://momentjs.com/docs/#/manipulating/start-of/
    // '2021-06-28' to '2021-06-28T00:00:00.000Z'
    return moment(yyyymmdd, 'YYYY-MM-DD').startOf('day').utc().toISOString();
  },
  convertYYYYMMDDStrToUTCEndOfTime(yyyymmdd) {
    // https://momentjs.com/docs/#/manipulating/end-of/
    // '2021-06-28' to '2021-06-28T23:59:59.000Z'
    return moment(yyyymmdd, 'YYYY-MM-DD').endOf('day').utc().toISOString();
  },
  // @ deprecated
  convertLocalYYYYMMDDHHmmssStrToUTC(str) {
    return this.convertLocalToUTCYYYYMMDDHHmmss(str);
  },
  /**
   * local 시각 문자열(YYYYMMDDHHmmss)을 UTC unixTime 시각 문자열로 바꿔줍니다.
   *
   * @param {string} localTimeStr - local 기준의 YYYYMMDDHHmmss 포맷의 시각 문자열(ex: '2021-06-28 06:03:01')
   *
   * @return {string} UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
   */
  convertLocalToUTCYYYYMMDDHHmmss(localTimeStr) {
    return moment(localTimeStr, YYYYMMDDHHmmss).utc().toISOString();
  },
  /**
   * UTC unixTime 시각 문자열을 local의 시간으로 포맷(YYYYMMDDHHmmss)에 맞게 바꿔줍니다.
   *
   * @param {string} utcTimeStr - UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
   *
   * @return {string} local 기준의 YYYYMMDDHHmmss 포맷의 시각 문자열(ex: '2021-06-28 06:03:01')
   */
  convertUTCToLocalYYYYMMDDHHmmss(utcTimeStr) {
    return moment(utcTimeStr).format(YYYYMMDDHHmmss);
  },
  convertUTCToLocalYYYYMMDD(utc) {
    // '2021-06-28T06:03:01.291Z' to '2021-06-28'
    return moment(utc).format(YYYYMMDD);
  },
  convertUTCToLocalHHmmss(utc) {
    // '2021-06-28T06:03:01.291Z' to '06:03:01'
    return moment(utc).format(HHmmss);
  },
  /**
   * 문자열 'HH:mm'로 표현된 시간을 UTC에서 Local로 바꿔줍니다.
   *
   * @param {string} UTCHHmmStr - UTC 기준의 'HH:mm' 형식의 시간 문자열
   *
   * @return {string} Local 기준의 'HH:mm' 형식의 시간 문자열
   */
  convertUTCToLocalHHmmStr(UTCHHmmStr) {
    const UTCHHmmArr = UTCHHmmStr.split(':');
    const hours = Number(UTCHHmmArr[0]);
    const minutes = Number(UTCHHmmArr[1]);
    // eslint-disable-next-line newline-per-chained-call
    const utcISOString = moment().utc().hour(hours).minute(minutes).toISOString();
    return moment(utcISOString).format('HH:mm');
  },
  /**
   * 문자열 'HH:mm'로 표현된 시간을 UTC에서 Local로 바꿔줍니다.
   *
   * @param {string} LocalHHmmStr - Local 기준의 'HH:mm' 형식의 시간 문자열
   *
   * @return {string} Local 기준의 'HH:mm' 형식의 시간 문자열
   */
  convertLocalToUTCHHmmStr(LocalHHmmStr) {
    const LocalHHmmArr = LocalHHmmStr.split(':');
    const hours = Number(LocalHHmmArr[0]);
    const minutes = Number(LocalHHmmArr[1]);
    const localMoment = moment().hour(hours).minute(minutes);
    return moment(localMoment).utc().format('HH:mm');
  },
  // '2021-06-28T06:03:01.291Z' to '2021-06-28 06:03:01'
  // @ Deprecated
  convertUnixTimeToReadable(unixTime) {
    return this.convertUTCToLocalYYYYMMDDHHmmss(unixTime);
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
  // @ Deprecated
  convertDeliveryIdShortReadable(deliveryId) {
    if (!deliveryId) return '';
    return this.convertUUIDShortReadable(deliveryId);
  },
  convertUUIDShortReadable(id) {
    if (!id) {
      return '';
    }
    return id.slice(0, 8).toUpperCase();
  },
  makeStrKey: (key) => `${key}`,
  isSameKeys(a, b) {
    if (!a || !b) {
      return false;
    }
    return this.makeStrKey(a) === this.makeStrKey(b);
  },
  /**
   * 값을 요소로 가지는 2개 배열을 비교하여, 추가(add)된 것과 삭제(remove)된 것을 구분해줍니다.
   *
   * @param {array} origin - 원본 배열
   * @param {array} modified - 수정된 배열
   *
   * @return {object} add: 추가된 값들, remove 삭제된 값들
   */
  branchAddRemove(origin, modified) {
    // 1. https://lodash.com/docs/4.17.15#difference
    return {
      add: lodash.difference(modified, origin),
      remove: lodash.difference(origin, modified),
    };
  },
  /**
   * 두 개의 배열을 합칩니다. 중복된 값은 1개만 남겨 unique를 보장합니다.
   * https://lodash.com/docs/4.17.15#union
   *
   * @param {array} origin - 원본 배열
   * @param {array} add - 추가된 배열
   *
   * @return {array} origin과 add가 합쳐진 배열
   */
  lodashUnion(origin, add) {
    return lodash.union(origin, add);
  },
  /**
   * origin 배열에서 remove 배열의 인자들을 제거합니다.
   * https://lodash.com/docs/4.17.15#without
   *
   * @param {array} origin - 원본 배열
   * @param {array} remove - 제거할 인자들의 배열
   *
   * @return {array} origin에서 remove의 인자를 제거한 배열
   */
  lodashWithout(origin, remove) {
    return lodash.without(origin, ...remove);
  },
  /**
   * 두 개의 정수(숫자,문자열)를 비교해서 같은지 알려줍니다.
   * @param {string|number} a
   * @param {string|number} b
   *
   * @return {void} 같은 정수인지 여부
   */
  isSameInteger(a, b) {
    if (a !== '0' && a !== 0 && b !== '0' && b !== 0 && (!a || !b)) {
      return false;
    }
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return false;
    }
    // 소수점을 가지는 실수는 비교하지 않는다.
    const aInt = parseInt(a, 10);
    const bInt = parseInt(b, 10);
    if (aInt !== Number(a)) {
      return false;
    }
    if (bInt !== Number(b)) {
      return false;
    }
    return aInt === bInt;
  },
};
