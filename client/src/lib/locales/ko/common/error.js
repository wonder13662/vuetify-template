export default {
  notValidValue: '유효한 값이 아닙니다.',
  notValidDelivery: 'delivery가 유효하지 않습니다.',
  notValidSubDelivery: 'subDelivery가 유효하지 않습니다.',
  notValidCSTicket: 'customerServiceTicket이 유효하지 않습니다.',
  notValidDriver: 'driver가 유효하지 않습니다.',
  password: {
    required: '필수값입니다.',
    mustContainAtLeast1LowercaseAlphabet: '알파벳 소문자가 1개 이상 포함되어야 합니다.',
    mustContainAtLeast1UppercaseAlphabet: '알파벳 대문자가 1개 이상 포함되어야 합니다.',
    mustContainAtLeast1Number: '숫자가 1개 이상 포함되어야 합니다.',
    mustContainAtLeast1SpecialCharacter: '특수문자가 1개 이상 포함되어야 합니다.',
    mustGreaterThanOrEqual8Letters: '8글자 이상이어야 합니다.',
  },
  personName: {
    required: '필수값입니다.',
    mustGreaterThanOrEqual2Letters: '2글자 이상이어야 합니다.',
    mustLessThanOrEqual10Letters: '10글자 이하여야 합니다.',
  },
  phoneNumber: {
    required: '필수값입니다.',
    notValidFormat: '유효한 전화번호 형식이 아닙니다.',
  },
  email: {
    required: '필수값입니다.',
    notValidFormat: '유효한 이메일 형식이 아닙니다.',
  },
  accountNumber: {
    required: '필수값입니다.',
    notValidFormat: '유효한 계좌번호 형식이 아닙니다.',
  },
  driverWorkingStatus: {
    mustContainAtLeastOne: '드라이버 근무 상태를 최소 1개 이상 선택해야 합니다',
  },
  driverTransportation: {
    mustContainAtLeastOne: '드라이버 선택 운송수단을 최소 1개 이상 선택해야 합니다',
  },
  directorGroupList: {
    required: '필수값입니다.',
    mustGreaterThanOrEqual2Letters: '2글자 이상이어야 합니다.',
    mustLessThanOrEqual200Letters: '200글자 이하여야 합니다.',
  },
  lib: {
    auth: {
      notValidToken: 'token이 유효하지 않습니다.',
    },
    naverMap: {
      notValidClientId: 'clientId가 유효하지 않습니다.',
      notValidMarkers: '지도에 그릴 마커 정보가 유효하지 않습니다.',
      notValidNaverApi: '네이버 지도 Api가 유효하지 않습니다.',
      notValidBounds: '지도 경계 정보가 유효하지 않습니다.',
      notValidMap: '네이버 맵 객체가 유효하지 않습니다.',
      notValidCoordinates: '지도에 그릴 폴리라인의 좌표 배열(coords)이 유효하지 않습니다.',
      notValidPoints: '번의 coord이 지도에 그릴 폴리라인의 시작점과 끝점이 유효하지 않습니다.',
      notSupportedStyle: '지원하지 않는 스타일입니다.',
      notImplementedStyleFill: 'STYLE_FILL은 아직 구현되지 않았습니다.',
      polylineFactory: {
        notValidStart: 'start 객체가 유효하지 않습니다.',
        notValidEnd: 'end 객체가 유효하지 않습니다.',
      },
    },
  },
};
