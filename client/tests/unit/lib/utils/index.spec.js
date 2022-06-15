import { v4 as uuidv4 } from 'uuid';
import utils from '@/lib/utils';

describe('#1 isUUIDType', () => {
  test('#1-1', () => {
    const uuid = uuidv4();
    expect(utils.isUUIDType(uuid)).toBeTruthy();
  });

  test('#1-2', () => {
    const uuid = null;
    expect(utils.isUUIDType(uuid)).toBeFalsy();
  });  
});

describe('#2 isValidArray', () => {
  test('#2-1', () => {
    expect(utils.isValidArray([1])).toBeTruthy();
  });

  test('#2-2', () => {
    expect(utils.isValidArray([])).toBeFalsy();
  });

  test('#2-3', () => {
    expect(utils.isValidArray([1], 2)).toBeFalsy();
  });

  test('#2-4', () => {
    expect(utils.isValidArray([1, 2], 2)).toBeTruthy();
  });

  test('#2-5', () => {
    expect(utils.isValidArray([1, 2], 2)).toBeTruthy();
  });

  test('#2-6', () => {
    expect(utils.isValidArray(null)).toBeFalsy();
  });

  test('#2-7', () => {
    expect(utils.isValidArray(undefined)).toBeFalsy();
  });

  test('#2-8', () => {
    expect(utils.isValidArray(NaN)).toBeFalsy();
  });

  test('#2-9', () => {
    expect(utils.isValidArray('a')).toBeFalsy();
  });

  test('#2-10', () => {
    expect(utils.isValidArray({})).toBeFalsy();
  });

  test('#2-11', () => {
    expect(utils.isValidArray(1)).toBeFalsy();
  });

  test('#2-12', () => {
    expect(utils.isValidArray(true)).toBeFalsy();
  });

  test('#2-13', () => {
    expect(utils.isValidArray(false)).toBeFalsy();
  });

  test('#2-14', () => {
    expect(utils.isValidArray(() => {})).toBeFalsy();
  });

  test('#2-15', () => {
    expect(utils.isValidArray(Symbol())).toBeFalsy();
  });  
});

describe('#3 isBoolean', () => {
  test('#3-1', () => {
    expect(utils.isBoolean(true)).toBeTruthy();
  });

  test('#3-2', () => {
    expect(utils.isBoolean(false)).toBeTruthy();
  });

  test('#3-6', () => {
    expect(utils.isBoolean(null)).toBeFalsy();
  });

  test('#3-7', () => {
    expect(utils.isBoolean(undefined)).toBeFalsy();
  });

  test('#3-8', () => {
    expect(utils.isBoolean(NaN)).toBeFalsy();
  });

  test('#3-9', () => {
    expect(utils.isBoolean('a')).toBeFalsy();
  });

  test('#3-10', () => {
    expect(utils.isBoolean({})).toBeFalsy();
  });

  test('#3-11', () => {
    expect(utils.isBoolean(1)).toBeFalsy();
  });

  test('#3-14', () => {
    expect(utils.isBoolean(() => {})).toBeFalsy();
  });

  test('#3-15', () => {
    expect(utils.isBoolean(Symbol())).toBeFalsy();
  });    
});

describe('#4 convertObjToSet', () => {
  test('#4-1', () => {
    const obj = { value: 1 };
    const set = utils.convertObjToSet(obj);
    expect(set.size).toBe(1);
    expect(set.has(obj.value)).toBeTruthy();
  });

  test('#4-2', () => {
    const obj = {};
    const set = utils.convertObjToSet(obj);
    expect(set.size).toBe(0);
  });

  test('#4-3', () => {
    const list = [];
    const set = utils.convertObjToSet(list);
    expect(set.size).toBe(list.length);
  });  

  test('#4-4', () => {
    const list = [1,2,3];
    const set = utils.convertObjToSet(list);
    expect(set.size).toBe(list.length);
    expect(set.has(list[0])).toBeTruthy();
    expect(set.has(list[list.length - 1])).toBeTruthy();
  });

  test('#4-5', () => {
    const list = ['a','b','c'];
    const set = utils.convertObjToSet(list);
    expect(set.size).toBe(list.length);
    expect(set.has(list[0])).toBeTruthy();
    expect(set.has(list[list.length - 1])).toBeTruthy();
  });  

  test('#4-6', () => {
    const set = utils.convertObjToSet(null);
    expect(set.size).toBe(0);
  });

  test('#4-7', () => {
    const set = utils.convertObjToSet(undefined);
    expect(set.size).toBe(0);
  });

  test('#4-8', () => {
    const set = utils.convertObjToSet(NaN);
    expect(set.size).toBe(0);
  });

  test('#4-9', () => {
    const set = utils.convertObjToSet('a');
    expect(set.size).toBe(0);
  });

  test('#4-10', () => {
    const set = utils.convertObjToSet({});
    expect(set.size).toBe(0);
  });

  test('#4-11', () => {
    const set = utils.convertObjToSet(1);
    expect(set.size).toBe(0);
  });

  test('#4-12', () => {
    const set = utils.convertObjToSet(true);
    expect(set.size).toBe(0);
  });

  test('#4-13', () => {
    const set = utils.convertObjToSet(false);
    expect(set.size).toBe(0);
  });

  test('#4-14', () => {
    const set = utils.convertObjToSet(() => {});
    expect(set.size).toBe(0);
  });

  test('#4-15', () => {
    const set = utils.convertObjToSet(Symbol());
    expect(set.size).toBe(0);
  });
});

describe('#5 convertListToSet', () => {
  test('#5-1', () => {
    const list = [1, 2, 3];
    const set = utils.convertListToSet(list);
    expect(set.size).toBe(list.length);
    expect(set.has(list[0])).toBeTruthy();
    expect(set.has(list[list.length - 1])).toBeTruthy();
  });

  test('#5-2', () => {
    const list = ['a', 'b', 'c'];
    const set = utils.convertListToSet(list);
    expect(set.size).toBe(list.length);
    expect(set.has(list[0])).toBeTruthy();
    expect(set.has(list[list.length - 1])).toBeTruthy();
  });

  test('#5-3', () => {
    const list = [];
    const set = utils.convertListToSet(list);
    expect(set.size).toBe(list.length);
  });
  
  test('#5-4', () => {
    const set = utils.convertListToSet(null);
    expect(set.size).toBe(0);
  });

  test('#5-5', () => {
    const set = utils.convertListToSet(undefined);
    expect(set.size).toBe(0);
  });

  test('#5-6', () => {
    const set = utils.convertListToSet(NaN);
    expect(set.size).toBe(0);
  });

  test('#5-7', () => {
    const set = utils.convertListToSet('a');
    expect(set.size).toBe(0);
  });

  test('#5-8', () => {
    const set = utils.convertListToSet({});
    expect(set.size).toBe(0);
  });

  test('#5-9', () => {
    const set = utils.convertListToSet(1);
    expect(set.size).toBe(0);
  });

  test('#5-10', () => {
    const set = utils.convertListToSet(true);
    expect(set.size).toBe(0);
  });

  test('#5-11', () => {
    const set = utils.convertListToSet(false);
    expect(set.size).toBe(0);
  });

  test('#5-12', () => {
    const set = utils.convertListToSet(() => {});
    expect(set.size).toBe(0);
  });

  test('#5-13', () => {
    const set = utils.convertListToSet(Symbol());
    expect(set.size).toBe(0);
  });  
});

describe('#6 convertSetToList', () => {
  test('#6-1', () => {
    const set = new Set();
    set.add(1);
    set.add(2);
    const list = utils.convertSetToList(set);
    expect(list.length).toBe(set.size);
    expect(set.has(list[0])).toBeTruthy();
    expect(set.has(list[list.length - 1])).toBeTruthy();
  });

  test('#6-2', () => {
    const set = new Set();
    const list = utils.convertSetToList(set);
    expect(list.length).toBe(set.size);
  });

  test('#6-3', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);    
    const list = utils.convertSetToList(map);
    expect(list.length).toBe(0);
  });

  test('#6-4', () => {
    const map = new Map();
    const list = utils.convertSetToList(map);
    expect(list.length).toBe(0);
  });

  test('#6-5', () => {
    const list = utils.convertSetToList(null);
    expect(list.length).toBe(0);
  });

  test('#6-6', () => {
    const list = utils.convertSetToList(undefined);
    expect(list.length).toBe(0);
  });

  test('#6-7', () => {
    const list = utils.convertSetToList(NaN);
    expect(list.length).toBe(0);
  });

  test('#6-8', () => {
    const list = utils.convertSetToList('a');
    expect(list.length).toBe(0);
  });

  test('#6-9', () => {
    const list = utils.convertSetToList({});
    expect(list.length).toBe(0);
  });

  test('#6-10', () => {
    const list = utils.convertSetToList(1);
    expect(list.length).toBe(0);
  });

  test('#6-11', () => {
    const list = utils.convertSetToList(true);
    expect(list.length).toBe(0);
  });

  test('#6-12', () => {
    const list = utils.convertSetToList(false);
    expect(list.length).toBe(0);
  });

  test('#6-13', () => {
    const list = utils.convertSetToList(() => {});
    expect(list.length).toBe(0);
  });

  test('#6-14', () => {
    const list = utils.convertSetToList(Symbol());
    expect(list.length).toBe(0);
  });
});

describe('#7 convertMapToList', () => {
  test('#7-1', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);    
    const list = utils.convertMapToList(map);
    expect(list.length).toBe(map.size);
  });

  test('#7-2', () => {
    const map = new Map();
    const list = utils.convertMapToList(map);
    expect(list.length).toBe(map.size);
  });

  test('#7-3', () => {
    const set = new Set();
    const list = utils.convertMapToList(set);
    expect(list.length).toBe(0);
  });

  test('#7-4', () => {
    const set = new Set();
    set.add(1);
    set.add(2);
    const list = utils.convertMapToList(set);
    expect(list.length).toBe(0);
  });

  test('#7-5', () => {
    const list = utils.convertMapToList(null);
    expect(list.length).toBe(0);
  });

  test('#7-6', () => {
    const list = utils.convertMapToList(undefined);
    expect(list.length).toBe(0);
  });

  test('#7-7', () => {
    const list = utils.convertMapToList(NaN);
    expect(list.length).toBe(0);
  });

  test('#7-8', () => {
    const list = utils.convertMapToList('a');
    expect(list.length).toBe(0);
  });

  test('#7-9', () => {
    const list = utils.convertMapToList({});
    expect(list.length).toBe(0);
  });

  test('#7-10', () => {
    const list = utils.convertMapToList(1);
    expect(list.length).toBe(0);
  });

  test('#7-11', () => {
    const list = utils.convertMapToList(true);
    expect(list.length).toBe(0);
  });

  test('#7-12', () => {
    const list = utils.convertMapToList(false);
    expect(list.length).toBe(0);
  });

  test('#7-13', () => {
    const list = utils.convertMapToList(() => {});
    expect(list.length).toBe(0);
  });

  test('#7-14', () => {
    const list = utils.convertMapToList(Symbol());
    expect(list.length).toBe(0);
  });
});

describe('#8 convertObjValuesToList', () => {
  test('#8-1', () => {
    const obj = {
      'a': 1,
      'b': 2,
      'c': 3,
    };
    const list = utils.convertObjValuesToList(obj);
    expect(list.length).toBe(3);
    expect(list.find((v) => v === 1)).toBeTruthy();
  });

  test('#8-2', () => {
    const obj = {};
    const list = utils.convertObjValuesToList(obj);
    expect(list.length).toBe(0);
  });

  test('#8-3', () => {
    const list = utils.convertObjValuesToList(null);
    expect(list.length).toBe(0);
  });

  test('#8-4', () => {
    const list = utils.convertObjValuesToList(undefined);
    expect(list.length).toBe(0);
  });

  test('#8-5', () => {
    const list = utils.convertObjValuesToList(NaN);
    expect(list.length).toBe(0);
  });

  test('#8-6', () => {
    const list = utils.convertObjValuesToList('a');
    expect(list.length).toBe(0);
  });

  test('#8-7', () => {
    const list = utils.convertObjValuesToList({});
    expect(list.length).toBe(0);
  });

  test('#8-8', () => {
    const list = utils.convertObjValuesToList(1);
    expect(list.length).toBe(0);
  });

  test('#8-9', () => {
    const list = utils.convertObjValuesToList(true);
    expect(list.length).toBe(0);
  });

  test('#8-10', () => {
    const list = utils.convertObjValuesToList(false);
    expect(list.length).toBe(0);
  });

  test('#8-11', () => {
    const list = utils.convertObjValuesToList(() => {});
    expect(list.length).toBe(0);
  });

  test('#8-12', () => {
    const list = utils.convertObjValuesToList(Symbol());
    expect(list.length).toBe(0);
  });  
});

describe('#9 getNowYYYYMMDD', () => {
  test('#9-1', () => {
    const result = utils.getNowYYYYMMDD();
    expect(result).toBeTruthy();
    expect(utils.isBefore(result, result)).toBeFalsy();
    expect(utils.isAfter(result, result)).toBeFalsy();
  });
});

describe('#10 isBefore', () => {
  test('#10-1', () => {
    const before = '2022-04-01';
    const after = '2022-04-02';
    expect(utils.isBefore(before, after)).toBeTruthy();
  });

  test('#10-2', () => {
    const before = '2022-04-01';
    const after = '2022-04-01';
    expect(utils.isBefore(before, after)).toBeFalsy();
  });

  test('#10-3', () => {
    const before = '2022-04-01';
    const after = '2022-03-31';
    expect(utils.isBefore(before, after)).toBeFalsy();
  });  
});

describe('#11 isAfter', () => {
  test('#11-1', () => {
    const before = '2022-04-01';
    const after = '2022-04-02';
    expect(utils.isAfter(after, before)).toBeTruthy();
  });

  test('#11-2', () => {
    const before = '2022-04-01';
    const after = '2022-04-01';
    expect(utils.isAfter(after, before)).toBeFalsy();
  });

  test('#11-3', () => {
    const before = '2022-04-01';
    const after = '2022-03-31';
    expect(utils.isAfter(after, before)).toBeFalsy();
  });
});

describe('#12 convertDateNHourToUTC', () => {
  test('#12-1', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const nowUTC = utils.convertDateNHourToUTC(nowLocalYYYYMMDD);
    expect(nowLocalYYYYMMDD).not.toBe(nowUTC);
  });
});

describe('#13 convertYYYYMMDDStrToUTCStartOfTime', () => {
  test('#13-1', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const startOfTime = utils.convertYYYYMMDDStrToUTCStartOfTime(nowLocalYYYYMMDD);
    expect(nowLocalYYYYMMDD).not.toBe(startOfTime);
    const endOfTime = utils.convertYYYYMMDDStrToUTCEndOfTime(nowLocalYYYYMMDD);
    expect(utils.isBefore(startOfTime, endOfTime)).toBeTruthy();
  });
});

describe('#14 convertYYYYMMDDStrToUTCEndOfTime', () => {
  test('#14-1', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const endOfTime = utils.convertYYYYMMDDStrToUTCEndOfTime(nowLocalYYYYMMDD);
    expect(nowLocalYYYYMMDD).not.toBe(endOfTime);
    const startOfTime = utils.convertYYYYMMDDStrToUTCStartOfTime(nowLocalYYYYMMDD);
    expect(utils.isAfter(endOfTime, startOfTime)).toBeTruthy();
  });
});

describe('#15 convertUTCToLocalYYYYMMDD', () => {
  test('#15-1', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const endOfTime = utils.convertYYYYMMDDStrToUTCEndOfTime(nowLocalYYYYMMDD);
    const localYYYYMMDD = utils.convertUTCToLocalYYYYMMDD(endOfTime);
    expect(nowLocalYYYYMMDD).toBe(localYYYYMMDD);
  });
});

describe('#16 convertUTCToLocalHHmmss', () => {
  test('#16-1', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const startOfTime = utils.convertYYYYMMDDStrToUTCStartOfTime(nowLocalYYYYMMDD);
    const result = utils.convertUTCToLocalHHmmss(startOfTime);
    expect(result).toBe('00:00:00');
  });

  test('#16-2', () => {
    const nowLocalYYYYMMDD = utils.getNowYYYYMMDD();
    const endOfTime = utils.convertYYYYMMDDStrToUTCEndOfTime(nowLocalYYYYMMDD);
    const result = utils.convertUTCToLocalHHmmss(endOfTime);
    expect(result).toBe('23:59:59');
  });  
});

describe('#17 convertLocalToUTCYYYYMMDDHHmmss', () => {
  test('#17-1', () => {
    const local = '2021-06-28 06:03:01';
    const utc = utils.convertLocalToUTCYYYYMMDDHHmmss(local);
    expect(local).not.toBe(utc);
  });
});

describe('#18 convertUTCToLocalYYYYMMDDHHmmss', () => {
  test('#18-1', () => {
    const utc = '2021-06-28T06:03:01.291Z';
    const local = utils.convertLocalToUTCYYYYMMDDHHmmss(utc);
    expect(utc).not.toBe(local);
  });
});

describe('#19 convertUTCToLocalHHmmStr', () => {
  test('#19-1', () => {
    const UTCHHmmStr = '00:00';
    const LocalHHmmStr = utils.convertUTCToLocalHHmmStr(UTCHHmmStr);
    expect(UTCHHmmStr).not.toBe(LocalHHmmStr);
    const UTCHHmmStrAgain = utils.convertLocalToUTCHHmmStr(LocalHHmmStr);
    expect(UTCHHmmStr).toBe(UTCHHmmStrAgain);
  });
});

describe('#20 convertLocalToUTCHHmmStr', () => {
  test('#20-1', () => {
    const LocalHHmmStr = '00:00'
    const UTCHHmmStr = utils.convertLocalToUTCHHmmStr(LocalHHmmStr);
    expect(LocalHHmmStr).not.toBe(UTCHHmmStr);
    const LocalHHmmStrAgain = utils.convertUTCToLocalHHmmStr(UTCHHmmStr);
    expect(LocalHHmmStr).toBe(LocalHHmmStrAgain);
  });
});

describe('#21 isSameKeys', () => {
  test('#21-1', () => {
    expect(utils.isSameKeys(1, '1')).toBeTruthy();
    expect(utils.isSameKeys(1, 1)).toBeTruthy();
    expect(utils.isSameKeys('1', 1)).toBeTruthy();
  });

  test('#21-2', () => {
    expect(utils.isSameKeys(null, '1')).toBeFalsy();
    expect(utils.isSameKeys(undefined, '1')).toBeFalsy();
    expect(utils.isSameKeys('1', null)).toBeFalsy();
    expect(utils.isSameKeys('1', undefined)).toBeFalsy();
  });  
});

describe('#22 branchAddRemove', () => {
  test('#22-1', () => {
    const origin = [0,1,2,3];
    const modified = [2,3,4,5];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual([4,5]);
    expect(remove).toEqual([0,1]);
  });

  test('#22-2', () => {
    const origin = [0,1,2,3];
    const modified = [];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });  

  test('#22-3', () => {
    const origin = [];
    const modified = [0,1,2,3];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });

  test('#22-4', () => {
    const origin = [];
    const modified = [];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });
});

describe('#23 isSameInteger', () => {
  test('#23-1', () => {
    expect(utils.isSameInteger(10, 10)).toBeTruthy();
    expect(utils.isSameInteger(10, '10')).toBeTruthy();
    expect(utils.isSameInteger(1, 1)).toBeTruthy();
    expect(utils.isSameInteger(1, '1')).toBeTruthy();
    expect(utils.isSameInteger(0, 0)).toBeTruthy();
    expect(utils.isSameInteger(-1, -1)).toBeTruthy();
    expect(utils.isSameInteger('-1', -1)).toBeTruthy();
    expect(utils.isSameInteger(-10, -10)).toBeTruthy();
    expect(utils.isSameInteger('-10', -10)).toBeTruthy();
    expect(utils.isSameInteger(null, null)).toBeFalsy();
    expect(utils.isSameInteger(undefined, undefined)).toBeFalsy();
    expect(utils.isSameInteger(null, 1)).toBeFalsy();
    expect(utils.isSameInteger(1, undefined)).toBeFalsy();
    expect(utils.isSameInteger(1, 1.1)).toBeFalsy();
    expect(utils.isSameInteger(1.1, 1)).toBeFalsy();
  });
});
