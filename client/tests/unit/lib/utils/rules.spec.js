import { rules } from '@/lib/utils';

describe('#1 email 유효성 검사', () => {
  test('#1-1', async () => {
    expect(rules.isValidEmail(undefined)).toBeFalsy();
    expect(rules.isValidEmail(null)).toBeFalsy();
    expect(rules.isValidEmail('')).toBeFalsy();
    expect(rules.isValidEmail(1)).toBeFalsy();
    expect(rules.isValidEmail(NaN)).toBeFalsy();
  });

  test('#1-2', async () => {
    expect(rules.isValidEmail('barogo_director')).toBeFalsy();
  });

  test('#1-3', async () => {
    expect(rules.isValidEmail('@barogo.com')).toBeFalsy();
  });

  test('#1-4', async () => {
    expect(rules.isValidEmail('barogo.com')).toBeFalsy();
  });  

  test('#1-5', async () => {
    expect(rules.isValidEmail('barogo_director@barogo.com')).toBeTruthy();
  });
});

xdescribe('#2-1 password 유효성 검사(Strong)', () => {
  test('#2-1-1', async () => {
    expect(rules.isValidPassword(undefined)).toBeFalsy();
    expect(rules.isValidPassword(null)).toBeFalsy();
    expect(rules.isValidPassword('')).toBeFalsy();
    expect(rules.isValidPassword(1)).toBeFalsy();
    expect(rules.isValidPassword(NaN)).toBeFalsy();
  });

  test('#2-1-2 비밀번호는 8글자 이상이어야 합니다.', async () => {
    expect(rules.isValidPassword('1234aA$')).toBeFalsy();
  });

  test('#2-1-3 비멀번호는 1개 이상의 영어 소문자를 포함해야 합니다.', async () => {
    expect(rules.isValidPassword('12345678A$')).toBeFalsy();
  });

  test('#2-1-4 비멀번호는 1개 이상의 영어 대문자를 포함해야 합니다.', async () => {
    expect(rules.isValidPassword('12345678a$')).toBeFalsy();
  });

  test('#2-1-5 비멀번호는 1개 이상의 숫자를 포함해야 합니다.', async () => {
    expect(rules.isValidPassword('abcdefgA^')).toBeFalsy();
  });

  test('#2-1-6 비멀번호는 1개 이상의 특수문자(!@#$%^&*) 포함해야 합니다.', async () => {
    expect(rules.isValidPassword('12345678Aa')).toBeFalsy();
  });

  test('#2-1-7 정상케이스', async () => {
    expect(rules.isValidPassword('12345678Aa!')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa@')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa#')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa$')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa%')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa^')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa&')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa*')).toBeTruthy();
  });  
});


describe('#2-3 password 유효성 검사(Weak)', () => {
  test('#2-3-1', async () => {
    expect(rules.isValidPassword(undefined)).toBeFalsy();
    expect(rules.isValidPassword(null)).toBeFalsy();
    expect(rules.isValidPassword('')).toBeFalsy();
    expect(rules.isValidPassword(1)).toBeFalsy();
    expect(rules.isValidPassword(NaN)).toBeFalsy();
  });

  test('#2-3-2 비밀번호는 8글자 이상이어야 합니다.', async () => {
    expect(rules.isValidPassword('1234aA$')).toBeFalsy();
  });

  test('#2-3-7 정상케이스', async () => {
    expect(rules.isValidPassword('12345678Aa!')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa@')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa#')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa$')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa%')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa^')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa&')).toBeTruthy();
    expect(rules.isValidPassword('12345678Aa*')).toBeTruthy();
  });  
});