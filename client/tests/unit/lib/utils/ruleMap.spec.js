import ruleMap from '@/lib/ruleMap';
import {
  RULE_KEY,
} from '@/lib/constants';

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