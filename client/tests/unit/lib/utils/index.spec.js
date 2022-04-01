import { v4 as uuidv4 } from 'uuid';
import utils from '@/lib/utils';
import ruleMap from '@/lib/ruleMap';
import {
  PERIOD_OPTION_FEE_STATUS,
  RULE_KEY,
} from '@/lib/constants';

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
    const list = utils.convertSetToList(null);
    expect(list.length).toBe(0);
  });

  test('#6-4', () => {
    const list = utils.convertSetToList(undefined);
    expect(list.length).toBe(0);
  });

  test('#6-5', () => {
    const list = utils.convertSetToList(NaN);
    expect(list.length).toBe(0);
  });

  test('#6-6', () => {
    const list = utils.convertSetToList('a');
    expect(list.length).toBe(0);
  });

  test('#6-7', () => {
    const list = utils.convertSetToList({});
    expect(list.length).toBe(0);
  });

  test('#6-8', () => {
    const list = utils.convertSetToList(1);
    expect(list.length).toBe(0);
  });

  test('#6-9', () => {
    const list = utils.convertSetToList(true);
    expect(list.length).toBe(0);
  });

  test('#6-10', () => {
    const list = utils.convertSetToList(false);
    expect(list.length).toBe(0);
  });

  test('#6-11', () => {
    const list = utils.convertSetToList(() => {});
    expect(list.length).toBe(0);
  });

  test('#6-12', () => {
    const list = utils.convertSetToList(Symbol());
    expect(list.length).toBe(0);
  });   
});

describe('#1 RULE_KEY.EMAIL', () => {
  test('#1-1', () => {
    expect(ruleMap.isValid(RULE_KEY.EMAIL, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.EMAIL, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.EMAIL, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.EMAIL, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.EMAIL, NaN)).toBeFalsy();
  });

  test('#1-2', () => {
    expect(ruleMap.isValid(RULE_KEY.EMAIL, 'barogo_director')).toBeFalsy();
  });

  test('#1-3', () => {
    expect(ruleMap.isValid(RULE_KEY.EMAIL, '@barogo.com')).toBeFalsy();
  });

  test('#1-4', () => {
    expect(ruleMap.isValid(RULE_KEY.EMAIL, 'barogo.com')).toBeFalsy();
  });  

  test('#1-5', () => {
    expect(ruleMap.isValid(RULE_KEY.EMAIL, 'barogo_director@barogo.com')).toBeTruthy();
  });
});

describe('#2-1 RULE_KEY.PASSWORD_STRONG', () => {
  test('#2-1-1', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, NaN)).toBeFalsy();
  });

  test('#2-1-2 비밀번호는 8글자 이상이어야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '1234aA$')).toBeFalsy();
  });

  test('#2-1-3 비멀번호는 1개 이상의 영어 소문자를 포함해야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678A$')).toBeFalsy();
  });

  test('#2-1-4 비멀번호는 1개 이상의 영어 대문자를 포함해야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678a$')).toBeFalsy();
  });

  test('#2-1-5 비멀번호는 1개 이상의 숫자를 포함해야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, 'abcdefgA^')).toBeFalsy();
  });

  test('#2-1-6 비멀번호는 1개 이상의 특수문자(!@#$%^&*) 포함해야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa')).toBeFalsy();
  });

  test('#2-1-7 정상케이스', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa!')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa@')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa#')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa$')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa%')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa^')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa&')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa*')).toBeTruthy();
  });  
});


describe('#2-3 isValidPassword(Weak)', () => {
  test('#2-3-1', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, NaN)).toBeFalsy();
  });

  test('#2-3-2 비밀번호는 8글자 이상이어야 합니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '1234aA$')).toBeFalsy();
  });

  test('#2-3-7 정상케이스', () => {
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa!')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa@')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa#')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa$')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa%')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa^')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa&')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PASSWORD_STRONG, '12345678Aa*')).toBeTruthy();
  });  
});

describe('#3 RULE_KEY.PHONE_NUMBER', () => {
  test('#3-1', () => {
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, NaN)).toBeFalsy();
  });

  test('#3-2 첫번째 숫자 그룹은 010, 011, 016, 017, 018, 019중 하나여야 합니다', () => {
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '011-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '012-1234-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '013-1234-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '014-1234-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '015-1234-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '016-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '017-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '018-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '019-1234-5678')).toBeTruthy();
  });

  test('#3-3 두번째 숫자 그룹은 0부터 9까지의 숫자로 구성된 3자리 또는 4자리 숫자들입니다', () => {
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-123456-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-12345-5678')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-123-4567')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-12-4567')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1-4567')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010--4567')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-4567')).toBeFalsy();
  });

  test('#3-4 세번째 숫자 그룹은 0부터 9까지의 숫자로 구성된 4자리 숫자들입니다', () => {
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-567890')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-56789')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-5678')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-567')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-56')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PHONE_NUMBER, '010-1234-5')).toBeFalsy();
  });
});

describe('#4 RULE_KEY.PERSON_NAME', () => {
  test('#4-1', () => {
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, NaN)).toBeFalsy();
  });
  
  test('#4-2 사람의 이름은 최소 3글자 이상입니다.', () => {
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, '가나다라')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, '가나다')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, '가나')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, '가')).toBeFalsy();
  });

  test('#4-3 사람의 이름은 최대 10글자 이하입니다.', () => {
    const name10Chars = '가나다라마바사아자차';
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, name10Chars)).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, `${name10Chars}1`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, `${name10Chars}가`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, `${name10Chars}12`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.PERSON_NAME, `${name10Chars}가나`)).toBeFalsy();
  });
});

describe('#5 RULE_KEY.DIRECTOR_GROUP_NAME', () => {
  test('#5-1', async () => {
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, undefined)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, null)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, '')).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, 1)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, NaN)).toBeFalsy();
  });
  
  test('#5-2 Director group의 이름은 최소 3글자 이상입니다.', async () => {
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, '가나다라')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, '가나다')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, '가나')).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, '가')).toBeFalsy();
  });

  test('#5-3 Director group의 이름은 최대 200글자 이하입니다.', async () => {
    const name10Chars = '가나다라마바사아자차';
    const names = [];
    for (let idx = 0; idx < 20; idx++) {
      names.push(name10Chars);
    }
    const name200Chars = names.join('');
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, name200Chars)).toBeTruthy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, `${name200Chars}1`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, `${name200Chars}가`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, `${name200Chars}12`)).toBeFalsy();
    expect(ruleMap.isValid(RULE_KEY.DIRECTOR_GROUP_NAME, `${name200Chars}가나`)).toBeFalsy();
  });
});

describe('#6 branchAddRemove', () => {
  test('#6-1', async () => {
    const origin = [0,1,2,3];
    const modified = [2,3,4,5];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual([4,5]);
    expect(remove).toEqual([0,1]);
  });

  test('#6-2', async () => {
    const origin = [0,1,2,3];
    const modified = [];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });  

  test('#6-3', async () => {
    const origin = [];
    const modified = [0,1,2,3];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });

  test('#6-4', async () => {
    const origin = [];
    const modified = [];
    const { add, remove } = utils.branchAddRemove(origin, modified);
    expect(add).toEqual(modified);
    expect(remove).toEqual(origin);
  });
});

describe('#6 convertObjValuesToList', () => {
  test('#6-1', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const list = utils.convertObjValuesToList(obj);
    expect(list).toEqual([1, 2, 3]);
  });

  test('#6-2', () => {
    const obj = {};
    const list = utils.convertObjValuesToList(obj);
    expect(list).toEqual([]);
  });  
});

describe('#7 convertObjToSet', () => {
  test('#7-1', () => {
    const set = utils.convertObjToSet(PERIOD_OPTION_FEE_STATUS);
    expect(set.has(PERIOD_OPTION_FEE_STATUS.ACTIVATED)).toBeTruthy();
    expect(set.has(PERIOD_OPTION_FEE_STATUS.DEACTIVATED)).toBeTruthy();
    expect(set.has(PERIOD_OPTION_FEE_STATUS.TERMINATED)).toBeTruthy();
    expect(set.has(null)).toBeFalsy();
    expect(set.has(false)).toBeFalsy();
    expect(set.has(undefined)).toBeFalsy();
  });
});

describe('#8 convertListToSet', () => {
  const {
    ACTIVATED,
    DEACTIVATED,
    TERMINATED,
  } = PERIOD_OPTION_FEE_STATUS;
  test('#8-1', () => {
    const set = utils.convertListToSet([ACTIVATED, DEACTIVATED, TERMINATED]);
    expect(set.has(ACTIVATED)).toBeTruthy();
    expect(set.has(DEACTIVATED)).toBeTruthy();
    expect(set.has(TERMINATED)).toBeTruthy();
    expect(set.has(null)).toBeFalsy();
    expect(set.has(false)).toBeFalsy();
    expect(set.has(undefined)).toBeFalsy();
  });
});

describe('#9 convertMapToList', () => {
  const {
    ACTIVATED,
    DEACTIVATED,
    TERMINATED,
  } = PERIOD_OPTION_FEE_STATUS;
  const map = new Map();
  map.set(ACTIVATED, '활성');
  map.set(DEACTIVATED, '비활성');
  map.set(TERMINATED, '종료');

  test('#9-1', () => {
    const list = utils.convertMapToList(map);
    expect(list.length).toBe(3);
    expect(list.find((v) => v === '활성')).toBeTruthy();
    expect(list.find((v) => v === '비활성')).toBeTruthy();
    expect(list.find((v) => v === '종료')).toBeTruthy();
  });
});

describe('#10 convertMapKeysToList', () => {
  const {
    ACTIVATED,
    DEACTIVATED,
    TERMINATED,
  } = PERIOD_OPTION_FEE_STATUS;
  const map = new Map();
  map.set(ACTIVATED, '활성');
  map.set(DEACTIVATED, '비활성');
  map.set(TERMINATED, '종료');

  test('#10-1', () => {
    const list = utils.convertMapKeysToList(map);
    expect(list.length).toBe(3);
    expect(list.find((v) => v === ACTIVATED)).toBeTruthy();
    expect(list.find((v) => v === DEACTIVATED)).toBeTruthy();
    expect(list.find((v) => v === TERMINATED)).toBeTruthy();
  });
});

describe('#11 isSameInteger', () => {
  test('#11-1', () => {
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
