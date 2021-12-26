import utils from '@/lib/utils';

describe('lib/utils/index.js', () => {
  test('#1 isValidPhoneNumber', () => {
    expect(utils.isValidPhoneNumber('010-1234-5678')).toBe(true);
    expect(utils.isValidPhoneNumber('10-1234-5678')).toBe(false);
  });

  test('#2 isValidEmail', () => {
    expect(utils.isValidEmail('tester3@test.com')).toBe(true);
    expect(utils.isValidEmail('tester3@test')).toBe(false);
  });

  test('#3 isUUIDType', () => {
    expect(utils.isUUIDType('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true);
    expect(utils.isUUIDType('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1')).toBe(false);
  });
});
