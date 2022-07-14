import moment from 'moment';
import lodash from 'lodash';

const YYYYMMDD = 'YYYY-MM-DD';
const YYYYMMDDHHmmss = 'YYYY-MM-DD HH:mm:ss';
const HHmmss = 'HH:mm:ss';
const convertDateNHourToMoment = (yyyymmdd, hour) => moment(yyyymmdd).add(hour, 'h');

/**
 * Local기준의 YYYY-MM-DD 포맷의 문자열과 시간(hour) 숫자값을 utc 기준의 unix time 문자열로 바꿔줍니다.
 * https://momentjs.com/docs/#/manipulating/utc/
 *
 * @param {string} yyyymmdd - YYYYMMDD 포맷('2022-03-18')의 문자열
 * @param {number} hour - 시간을 나타내는 숫자값. 0부터 23사이.
 *
 * @return {string} utc 기준의 unix time 문자열 ex: "2020-10-09T00:00:00Z"
 */
// eslint-disable-next-line max-len
const convertDateNHourToUTC = (yyyymmdd, hour) => convertDateNHourToMoment(yyyymmdd, hour).utc().format();

const isValidArray = (v, minLength = 1) => v && v.length > minLength;
const isUUIDType = (id) => {
  // https://www.postgresql.org/docs/9.1/datatype-uuid.html
  // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
  const rule = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return rule.test(id);
};
const isValidPhoneNumber = (phoneNumber) => { // REMOVE ME
  // https://luerangler-dev.tistory.com/41
  const rule = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
  return rule.test(phoneNumber);
};
const isValidEmail = (email) => { // REMOVE ME
  // https://www.w3resource.com/javascript/form/email-validation.php
  const rule = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i;
  return rule.test(email);
};
const isBoolean = (v) => typeof v === 'boolean';
const isValidString = (v, minLength = 0) => typeof v === 'string' && v.length > minLength;
const isPositiveInteger = (v) => {
  const safeNumber = Number(v);
  return Number.isInteger(safeNumber) && safeNumber > 0;
};
const isUnsignedInteger = (v) => {
  const safeNumber = Number(v);
  return Number.isInteger(safeNumber) && safeNumber >= 0;
};
/**
 * 두 개의 정수(숫자,문자열)를 비교해서 같은지 알려줍니다.
 * @param {string|number} a
 * @param {string|number} b
 *
 * @return {void} 같은 정수인지 여부
 */
const isSameInteger = (a, b) => {
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
};
const castStringToBoolean = (v) => {
  if (isValidString(v)) {
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
};
const convertListToSet = (list) => {
  if (!isValidArray(list)) {
    return new Set();
  }

  return list.reduce((acc, v) => {
    acc.add(v);
    return acc;
  }, new Set());
};
const convertSetToList = (aSet) => {
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set
  if (!aSet
      || typeof aSet !== 'object'
      || aSet.add === undefined
      || aSet.size === undefined
      || aSet.size === 0) {
    return [];
  }
  return Array.from(aSet);
};
const convertMapToList = (aMap) => {
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
};
const convertMapKeysToList = (map) => Array.from(new Map(map).keys());
const convertObjKeysToList = (obj) => Array.from(Object.keys(obj));
const convertObjValuesToList = (obj) => Array.from(Object.values(obj));
const hasAnyProperty = (v) => {
  if (!v) {
    return false;
  }

  const keys = convertObjKeysToList(v);
  if (!keys || keys.length === 0) {
    return false;
  }

  return true;
};
const convertObjToSet = (obj) => {
  if (!obj) {
    return new Set();
  }
  return convertListToSet(Object.values(obj));
};
const getNowYYYYMMDD = () => moment().format(YYYYMMDD);
const getNowUTC = () => moment().utc().toISOString();
/**
 * 오늘 날짜를 YYYY-MM-DD 포맷의 문자열로 결과를 돌려줍니다.
 *
 * @return {string} YYYY-MM-DD 포맷의 문자열 ex) 2010-10-21
 */
const getLocalNowYYYYMMDD = () => moment().format(YYYYMMDD);
/**
 * Local기준의 시작날짜, 시작시각, 종료날짜, 종료시각을 인자로 받아 UTC타입의 시작시각, 종료시각을 돌려줍니다.
 *
 * @param {string} startDate - YYYYMMDD 포맷('2022-03-18')의 문자열
 * @param {number} startHour - 시간을 나타내는 숫자값. 0부터 23사이.
 * @param {string} endDate - YYYYMMDD 포맷('2022-03-18')의 문자열
 * @param {number} endHour - 시간을 나타내는 숫자값. 0부터 23사이.
 *
 * @return {object} createdAt의 UTC 시작시간과 종료시간 속성을 가지는 객체
 */
const createUTCTermFromLocalTerm = (startDate, startHour, endDate, endHour) => {
  const start = convertDateNHourToUTC(startDate, startHour);
  const end = convertDateNHourToUTC(endDate, endHour);

  return {
    createdAt: {
      start,
      end,
    },
  };
};
/**
 * UTC unixTime 시각 문자열을 local의 시간으로 포맷(HHmmss)에 맞게 바꿔줍니다.
 *
 * @param {string} utcTimeStr - UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
 *
 * @return {string} local 기준의 HHmmss 포맷의 시각 문자열(ex: '06:03:01')
 */
const convertUTCToLocalHHmmss = (utc) => moment(utc).format(HHmmss);
/**
 * UTC unixTime 시각 문자열을 local의 시간으로 포맷(YYYYMMDD)에 맞게 바꿔줍니다.
 *
 * @param {string} utcTimeStr - UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
 *
 * @return {string} local 기준의 YYYYMMDD 포맷의 시각 문자열(ex: '2021-06-28')
 */
const convertUTCToLocalYYYYMMDD = (utc) => moment(utc).format(YYYYMMDD);
/**
 * UTC unixTime 시각 문자열을 local의 시간으로 포맷(YYYYMMDDHHmmss)에 맞게 바꿔줍니다.
 *
 * @param {string} utcTimeStr - UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
 *
 * @return {string} local 기준의 YYYYMMDDHHmmss 포맷의 시각 문자열(ex: '2021-06-28 06:03:01')
 */
const convertUTCToLocalYYYYMMDDHHmmss = (utcTimeStr) => moment(utcTimeStr).format(YYYYMMDDHHmmss);
/**
 * 문자열 'HH:mm'로 표현된 시간을 UTC에서 Local로 바꿔줍니다.
 *
 * @param {string} UTCHHmmStr - UTC 기준의 'HH:mm' 형식의 시간 문자열
 *
 * @return {string} Local 기준의 'HH:mm' 형식의 시간 문자열
 */
const convertUTCToLocalHHmmStr = (UTCHHmmStr) => {
  const UTCHHmmArr = UTCHHmmStr.split(':');
  const hours = Number(UTCHHmmArr[0]);
  const minutes = Number(UTCHHmmArr[1]);
  // eslint-disable-next-line newline-per-chained-call
  const utcISOString = moment().utc().hour(hours).minute(minutes).toISOString();
  return moment(utcISOString).format('HH:mm');
};
const convertTimeToReadable = (time) => {
  const timeSafe = (typeof time !== 'string') ? Number(time) : time;
  const timeReadable = moment(timeSafe).format(YYYYMMDDHHmmss);
  const momentTime = moment(timeSafe);
  const durationLeftInMinutes = moment.duration(momentTime.diff(moment())).minutes();
  return {
    timeReadable,
    durationLeftInMinutes,
  };
};
/**
 * 시간 포맷(YYYYMMDD) 문자열을 UTC 기준의 unixTime 문자열로 바꿔줍니다.
 * 시(hour), 분(minute), 초(second)는 00:00:00로 설정됩니다.
 *
 * https://momentjs.com/docs/#/manipulating/start-of/
 * ex) '2021-06-28' to '2021-06-28T00:00:00.000Z'
 *
 * @param {string} yyyymmdd - 시간 포맷(YYYYMMDD) 문자열(ex: '2021-06-28')
 *
 * @return {string} UTC 기준의 unixTime 문자열(ex: '2021-06-28T00:00:00.000Z')
 */
const convertYYYYMMDDStrToUTCStartOfTime = (yyyymmdd) => moment(yyyymmdd, 'YYYY-MM-DD').startOf('day').utc().toISOString();
/**
 * 시간 포맷(YYYYMMDD) 문자열을 UTC 기준의 unixTime 문자열로 바꿔줍니다.
 * 시(hour), 분(minute), 초(second)는 23:59:59로 설정됩니다.
 *
 * https://momentjs.com/docs/#/manipulating/end-of/
 * ex) '2021-06-28' to '2021-06-28T23:59:59.000Z'
 *
 * @param {string} yyyymmdd - 시간 포맷(YYYYMMDD) 문자열(ex: '2021-06-28')
 *
 * @return {string} UTC 기준의 unixTime 문자열(ex: '2021-06-28T23:59:59.000Z')
 */
const convertYYYYMMDDStrToUTCEndOfTime = (yyyymmdd) => moment(yyyymmdd, 'YYYY-MM-DD').endOf('day').utc().toISOString();
/**
 * local 시각 문자열(YYYYMMDDHHmmss)을 UTC unixTime 시각 문자열로 바꿔줍니다.
 *
 * @param {string} localTimeStr - local 기준의 YYYYMMDDHHmmss 포맷의 시각 문자열(ex: '2021-06-28 06:03:01')
 *
 * @return {string} UTC 기준의 unixTime 문자열(ex: '2021-06-28T06:03:01.291Z')
 */
// eslint-disable-next-line max-len
const convertLocalToUTCYYYYMMDDHHmmss = (localTimeStr) => moment(localTimeStr, YYYYMMDDHHmmss).utc().toISOString();
/**
 * 문자열 'HH:mm'로 표현된 시간을 UTC에서 Local로 바꿔줍니다.
 *
 * @param {string} LocalHHmmStr - Local 기준의 'HH:mm' 형식의 시간 문자열
 *
 * @return {string} Local 기준의 'HH:mm' 형식의 시간 문자열
 */
const convertLocalToUTCHHmmStr = (LocalHHmmStr) => {
  const LocalHHmmArr = LocalHHmmStr.split(':');
  const hours = Number(LocalHHmmArr[0]);
  const minutes = Number(LocalHHmmArr[1]);
  const localMoment = moment().hour(hours).minute(minutes);
  return moment(localMoment).utc().format('HH:mm');
};
/**
 * 오늘 날짜를 기준으로 정수형인 일수를 더합니다.
 * YYYY-MM-DD 포맷의 문자열로 결과를 돌려줍니다.
 *
 * @param {number} daysToSubtract - 오늘 날짜를 기준으로 더할 일수
 *
 * @return {string} YYYY-MM-DD 포맷의 문자열 ex) 2010-10-21
 */
const getLocalYYYYMMDDByAddDaysFromNow = (daysToAdd) => moment().add(daysToAdd, 'days').format(YYYYMMDD);
/**
 * moment의 isBefore의 wrapping 메서드.
 * YYYY-MM-DD 포맷의 문자열을 인자로 받습니다.
 *
 * https://momentjs.com/docs/#/query/is-before/
 * moment('2010-10-20').isBefore('2010-10-21'); // true
 *
 * @param {string} yyyymmddA - YYYY-MM-DD 포맷의 문자열
 * @param {string} yyyymmddB - YYYY-MM-DD 포맷의 문자열
 *
 * @return {boolean} yyyymmddA이 yyyymmddB보다 먼저인지 여부
 */
const isBefore = (yyyymmddA, yyyymmddB) => moment(yyyymmddA).isBefore(yyyymmddB);
/**
 * moment의 isSameOrBefore의 wrapping 메서드.
 * YYYY-MM-DD 포맷의 문자열을 인자로 받습니다.
 *
 * https://momentjs.com/docs/#/query/is-same-or-before/
 * moment('2010-10-20').isSameOrBefore('2010-10-20'); // true
 * moment('2010-10-20').isSameOrBefore('2010-10-21'); // true
 *
 * @param {string} yyyymmddA - YYYY-MM-DD 포맷의 문자열
 * @param {string} yyyymmddB - YYYY-MM-DD 포맷의 문자열
 *
 * @return {boolean} yyyymmddA이 yyyymmddB보다 먼저인지 여부
 */
const isSameOrBefore = (yyyymmddA, yyyymmddB) => moment(yyyymmddA).isSameOrBefore(yyyymmddB);
/**
 * moment의 isAfter의 wrapping 메서드.
 * YYYY-MM-DD 포맷의 문자열을 인자로 받습니다.
 *
 * https://momentjs.com/docs/#/query/is-after/
 * moment('2010-10-20').isAfter('2010-10-19'); // true
 *
 * @param {string} yyyymmddA - YYYY-MM-DD 포맷의 문자열
 * @param {string} yyyymmddB - YYYY-MM-DD 포맷의 문자열
 *
 * @return {boolean} yyyymmddA이 yyyymmddB보다 나중인지 여부
 */
const isAfter = (yyyymmddA, yyyymmddB) => moment(yyyymmddA).isAfter(yyyymmddB);
const convertUUIDShortReadable = (id) => {
  if (!id) {
    return '';
  }
  return id.slice(0, 8);
};
/**
 * graphql의 DateTime을 반환해 줍니다.
 *
 * @param {number} days - utc 기준 시각에서 며칠 더하기/빼기할 값
 *
 * @return {string} utc 기준 graphql DateTime 문자열
 */
const getGraphqlDateTimeByDays = (days = 0) => moment().add(days, 'days').utc().format();
/**
 * 인자로 받은 moment 객체 기준으로 diffHours에 가장 가까운 hour로 바꾸어 줍니다.
 *
 * @param {Moment} moment - Moment 객체
 * @param {number} diffHour - 시간의 범위. 이 시간단위를 기준으로 현재 hour에서 가장 가까운 hour를 구해줍니다.
 *
 * @return {number} diffHours에 가장 가까운 hour
 */
const getClosestHourByDiffHours = (m = moment(), diffHours = 3) => {
  const nowHour = m.hour();
  return Math.floor(nowHour / diffHours) * diffHours;
};
/**
 * @typedef timeRange - 시작날짜, 시작시각, 종료날짜, 종료시각을 가지고 있는 객체
 * @property {string} startDate - 시작날짜
 * @property {string} startHour - 시작시각
 * @property {string} endDate - 거래 요청 사용자
 * @property {string} endHour - 거래 지갑ID
 */
/**
 * 현재 시각을 기준으로 선택할 수 있는 지역(Local) 시간의 범위 객체(시작날짜, 시작시각, 종료날짜, 종료시각)를 TimeRange 타입을 만들어 돌려줍니다.
 *
 * @param {Moment} moment - Moment 객체
 * @param {number} diffHour - 시간의 범위. 현재 시각을 기준으로 이 범위만큼 시간을 빼서 시작점, 시간을 더해서 종료점을 구합니다.
 *
 * @return {timeRange} 시간범위를 돌려줍니다.
 */
const getLocalTimeRange = (m = moment(), diffHour = 3) => {
  const startM = m.clone();
  startM.subtract(diffHour, 'h');
  const startDate = startM.format(YYYYMMDD);
  const startHour = getClosestHourByDiffHours(startM, diffHour);

  const endM = m.clone();
  endM.add(diffHour, 'h');
  const endDate = endM.format(YYYYMMDD);
  const endHour = getClosestHourByDiffHours(endM, diffHour);

  return {
    startDate,
    startHour,
    endDate,
    endHour,
  };
};
/**
 * 두 개의 배열을 합칩니다. 중복된 값은 1개만 남겨 unique를 보장합니다.
 * https://lodash.com/docs/4.17.15#union
 *
 * @param {array} origin - 원본 배열
 * @param {array} add - 추가된 배열
 *
 * @return {array} origin과 add가 합쳐진 배열
 */
const lodashUnion = (origin, add) => lodash.union(origin, add);
/**
 * origin 배열에서 remove 배열의 인자들을 제거합니다.
 * https://lodash.com/docs/4.17.15#without
 *
 * @param {array} origin - 원본 배열
 * @param {array} remove - 제거할 인자들의 배열
 *
 * @return {array} origin에서 remove의 인자를 제거한 배열
 */
const lodashWithout = (origin, remove) => lodash.without(origin, ...remove);
/**
 * camelCase 문자열을 CONSTANT_CASE로 바꿔줍니다.
 * 참고
 * Naming Convention: https://en.wikipedia.org/wiki/Naming_convention_(programming)
 * Converter Sample: https://www.codegrepper.com/code-examples/javascript/convert+camelcase+to+snake+case+javascript
 *
 * @param {string} camelCase - camelCase 문자열
 *
 * @return {string} CONSTANT_CASE 문자열
 */
// eslint-disable-next-line camelcase
const camelCaseToCONSTANT_CASE = (camelCase) => camelCase.split(/(?=[A-Z])/).join('_').toUpperCase();
/**
 * Query String에 있는 값을 배열로 만드는 함수.
 * Vue Router의 this.$router.push({ query: { someArray } })로 넘길 경우,
 *
 * 1. someArray가 ['singleValue']일 경우
 * this.$router.query로 다시 조회하면 단일 String 값인 'singleValue'만 가져올 수 있음
 *
 * 2. someArray가 ['firstValue', 'secondValue']일 경우
 * this.$router.query로 다시 조회하면 배열 값인 ['firstValue', 'secondValue']만 가져올 수 있음
 *
 * 그러므로 Query String에 항목이 1개만 있는 경우 String으로 주고 복수개면 배열로 주기에 정규화가 필요함.
 *
 * e.g.>
 *
 *  ?orderAgencyId=foo => query.orderAgencyId === 'foo'
 *
 *  ?orderAgencyId=foo&orderAgencyId=bar => query.orderAgencyId === ['foo', 'bar']
 *
 * @param {string|string[]} value
 *
 * @return {array} 문자열 배열
 */
const convertQueryToArray = (value) => {
  const result = [];

  if (Array.isArray(value)) {
    result.push(...value);
  } else if (value) {
    result.push(value);
  }

  return result;
};
/**
 * 두 개의 object에 대해 깊은 비교(deep comparison)를 진행해서 동일한지 여부를 알려줍니다.
 * Object, Array, String, Number 사용 가능합니다.
 * lodash의 isMatch 사용
 * https://lodash.com/docs/4.17.15#isMatch
 *
 * @param {object} obj - 비교대상 객체 obj
 * @param {object} src - 비교대상 객체 src
 *
 * @return {boolean} 비교대상 obj, src가 동일한 속성을 가지고 있는지 여부
 */
const isMatch = (obj, src) => {
  if (!obj || !src) {
    return false;
  }
  return lodash.isMatch(obj, src);
};
/**
 * 3시간 단위의 시간값인지 확인해줍니다.
 * ex) 0, 3, 6, 9, 12, 15, 18, 21 은 유효합니다. 그 외는 유효하지 않습니다.
 *
 * @param {number} h - 3시간 단위의 시간 숫자값
 *
 * @return {boolean} 3시간 단위의 시간값인지 여부
 */
const is3HourUnit = (h) => h >= 0 && h <= 21 && h % 3 === 0;
const makeStrKey = (key) => `${key}`;
const isSameKeys = (a, b) => {
  if (!a || !b) {
    return false;
  }
  return makeStrKey(a) === makeStrKey(b);
};
/**
 * 값을 요소로 가지는 2개 배열을 비교하여, 추가(add)된 것과 삭제(remove)된 것을 구분해줍니다.
 *
 * https://lodash.com/docs/4.17.15#difference
 *
 * @param {array} origin - 원본 배열
 * @param {array} modified - 수정된 배열
 *
 * @return {object} add: 추가된 값들, remove 삭제된 값들
 */
const branchAddRemove = (origin, modified) => ({
  add: lodash.difference(modified, origin),
  remove: lodash.difference(origin, modified),
});

export default {
  isValidArray,
  isUUIDType,
  isValidPhoneNumber,
  isValidEmail,
  isBoolean,
  isValidString,
  isPositiveInteger,
  isUnsignedInteger,
  isSameInteger,
  castStringToBoolean,
  hasAnyProperty,
  convertObjToSet,
  convertListToSet,
  convertSetToList,
  convertMapToList,
  convertMapKeysToList,
  convertObjKeysToList,
  convertObjValuesToList,
  getNowYYYYMMDD,
  getNowUTC,
  getLocalNowYYYYMMDD,
  createUTCTermFromLocalTerm,
  convertDateNHourToUTC,
  convertUTCToLocalHHmmss,
  convertUTCToLocalYYYYMMDD,
  convertUTCToLocalYYYYMMDDHHmmss,
  convertUTCToLocalHHmmStr,
  convertTimeToReadable,
  convertYYYYMMDDStrToUTCStartOfTime,
  convertYYYYMMDDStrToUTCEndOfTime,
  convertLocalToUTCYYYYMMDDHHmmss,
  convertLocalToUTCHHmmStr,
  getLocalYYYYMMDDByAddDaysFromNow,
  isBefore,
  isSameOrBefore,
  isAfter,
  convertUUIDShortReadable,
  getGraphqlDateTimeByDays,
  getClosestHourByDiffHours,
  getLocalTimeRange,
  lodashUnion,
  lodashWithout,
  camelCaseToCONSTANT_CASE,
  convertQueryToArray,
  isMatch,
  is3HourUnit,
  makeStrKey,
  isSameKeys,
  branchAddRemove,
};
