import Vue from 'vue';
import { 
  createLocalVue,
} from '@vue/test-utils';
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid';

import store from '@/store';
import {
  DIRECTOR_GROUP__PAGE_MODE,
} from '@/lib/constants';

const localVue = createLocalVue();
localVue.use(Vuex);

const {
  DIRECTOR_GROUP_READ,
  DIRECTOR_GROUP_CREATE,
  DIRECTOR_GROUP_UPDATE,
} = DIRECTOR_GROUP__PAGE_MODE;

// TODO 조회 쿼리 mock 필요
// TODO 수정 쿼리 mock 필요
jest.mock('@/services', () => ({
  graphql: {
    directorGroup: {
      fetchList: jest.fn(() => ({
        count: 3,
        rows: [
          {
            name: "강남디렉터그룹",
            directorCount: 1,
            directorGroupId: "1d12a9da-651f-4043-88e6-23373084ac0a",
            DirectorGroupPhysicalGroups: [
              {
                PhysicalGroup: {
                  physicalGroupId: "9d78eea6-c2c4-40e3-82ab-fa7f495ab056",
                  name: "physicalGroup0"
                }
              },
            ],
            DirectorGroupDirectors: [
              {
                Director: {
                  serviceUserId: "c251f346-3f8a-4537-a905-78139e5c09a9",
                  name: "테스터2"
                }
              },
            ]
          },
          {
            name: "서울디렉터그룹",
            directorCount: 1,
            directorGroupId: "e0af1bf6-c439-47b9-9730-6ef969747d5e",
            DirectorGroupPhysicalGroups: [
              {
                PhysicalGroup: {
                  physicalGroupId: "9d78eea6-c2c4-40e3-82ab-fa7f495ab056",
                  name: "physicalGroup0"
                }
              },
              {
                PhysicalGroup: {
                  physicalGroupId: "fb8363cb-9a43-4e64-8154-9dca5883f4d8",
                  name: "physicalGroup1"
                }
              },        
            ],
            DirectorGroupDirectors: [
              {
                Director: {
                  serviceUserId: "c251f346-3f8a-4537-a905-78139e5c09a9",
                  name: "테스터2"
                }
              },
              {
                Director: {
                  serviceUserId: "e0e43326-75a1-4128-9086-6a1676dbddb1",
                  name: "테스터3"
                }
              },
            ]
          },
          {
            name: "경기디렉터그룹",
            directorCount: 20,
            directorGroupId: "e7862530-b8b9-4622-a79e-7344f18bbb49",
            DirectorGroupPhysicalGroups: [
              {
                PhysicalGroup: {
                  physicalGroupId: "9d78eea6-c2c4-40e3-82ab-fa7f495ab056",
                  name: "physicalGroup0"
                }
              },
              {
                PhysicalGroup: {
                  physicalGroupId: "fb8363cb-9a43-4e64-8154-9dca5883f4d8",
                  name: "physicalGroup1"
                }
              },
              {
                PhysicalGroup: {
                  physicalGroupId: "d9ac8a35-4336-4269-9cb2-76e36cbb9f29",
                  name: "physicalGroup99"
                }
              }
            ],
            DirectorGroupDirectors: [
              {
                Director: {
                  serviceUserId: "c251f346-3f8a-4537-a905-78139e5c09a9",
                  name: "테스터2"
                }
              },
              {
                Director: {
                  serviceUserId: "e0e43326-75a1-4128-9086-6a1676dbddb1",
                  name: "테스터3"
                }
              },
              {
                Director: {
                  serviceUserId: "04d9f116-c6ad-42e0-9332-8c2def1946bd",
                  name: "테스터4"
                }
              },
            ]
          }
        ]
      })),
    },
    physicalGroup: {
      fetchPhysicalGroupsInDirectorGroupList: jest.fn(() => ({
        physicalGroups:[
          {
            name: "physicalGroup0",
            physicalGroupId: "9d78eea6-c2c4-40e3-82ab-fa7f495ab056",
            h3PolygonCount: 8483,
            DirectorGroupPhysicalGroups: ['1', '2'],
            DispatchRoom: {
              maxNormalDriverCount: 1000,
            },
          },
          {
            name: "physicalGroup1",
            physicalGroupId: "fb8363cb-9a43-4e64-8154-9dca5883f4d8",
            h3PolygonCount: 2,
            DirectorGroupPhysicalGroups: ['1', '2'],
            DispatchRoom: {
                maxNormalDriverCount: 1000,
            },
          },
        ],
      })),
    },
  },
}));

describe('#1 [Vuex.store]디렉터 그룹 조회 페이지와 그룹생성/수정 페이지의 전환', () => {
  test('#1-1 그룹조회 페이지에서 그룹조회 페이지로 이동, 예외발생', async () => {
    // 검사: 저장된 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 그룹조회 페이지로 이동. 예외가 발생합니다.
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
    // 검사: 저장된 에러가 1개 추가되어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러와 데이터 상태를 초기화함 (반복되면 afterEach나 beforeEach에 넣자)
    store.dispatch('directorGroupList/clearDirectorGroup');
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
    store.dispatch('error/clearErrors');
  });

  test('#1-2 그룹조회 페이지에서 그룹생성 페이지로 이동', async () => {
    // 검사: 최초의 페이지 모드는 "읽기(DIRECTOR_GROUP_READ)"이어야 합니다.
    expect(store.getters['directorGroupList/pageMode']).toBe(DIRECTOR_GROUP_READ);
    // 이벤트: 사용자가 그룹생성 페이지로 이동. 페이지 모드가 "생성()"으로 바뀝니다.
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_CREATE });
    // 검사: 지금의 페이지 모드는 "읽기(DIRECTOR_GROUP_CREATE)"이어야 합니다.
    expect(store.getters['directorGroupList/pageMode']).toBe(DIRECTOR_GROUP_CREATE);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함 (반복되면 afterEach나 beforeEach에 넣자)
    store.dispatch('error/clearErrors');
    expect(store.getters['error/errors'].length).toBe(0);
  });

  test('#1-3 생성 페이지에서 생성 페이지로 이동, 예외 발생', async () => {
    // 이벤트: 사용자가 그룹생성 페이지로 이동. 예외 발생.
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_CREATE });
    // 검사: 저장된 에러가 1개 추가되어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함 (반복되면 afterEach나 beforeEach에 넣자)
    store.dispatch('error/clearErrors');
    expect(store.getters['error/errors'].length).toBe(0);
  });

  test('#1-4 생성 페이지에서 수정 페이지로 이동, 예외 발생', async () => {
    // 이벤트: 사용자가 그룹생성 페이지로 이동. 예외 발생.
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_UPDATE });
    // 검사: 저장된 에러가 1개 추가되어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함 (반복되면 afterEach나 beforeEach에 넣자)
    store.dispatch('error/clearErrors');
    expect(store.getters['error/errors'].length).toBe(0);
  });

  test('#1-5 생성 페이지에서 조회 페이지로 이동', async () => {
    // 이벤트: 사용자가 그룹조회 페이지로 이동. 예외 발생.
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
    // 검사: 현재 페이지 모드는 "읽기(DIRECTOR_GROUP_READ)"이어야 합니다.
    expect(store.getters['directorGroupList/pageMode']).toBe(DIRECTOR_GROUP_READ);
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });

  test('#1-6 조회 페이지에서 수정 페이지로 이동', async () => {
    // 이벤트: 사용자가 그룹조회 페이지에서 그룹수정 페이지로 이동
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_UPDATE });
    // 검사: 현재 페이지 모드는 "읽기(DIRECTOR_GROUP_UPDATE)"이어야 합니다.
    expect(store.getters['directorGroupList/pageMode']).toBe(DIRECTOR_GROUP_UPDATE);
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });

  test('#1-7 수정 페이지에서 수정 페이지로 이동. 예외 발생', async () => {
    // 이벤트: 사용자가 그룹수정 페이지에서 그룹수정 페이지로 이동
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_UPDATE });
    // 검사: 현재는 1개의 에러가 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });  

  test('#1-8 수정 페이지에서 생성 페이지로 이동. 예외 발생', async () => {
    // 이벤트: 사용자가 그룹수정 페이지에서 그룹수정 페이지로 이동
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_CREATE });
    // 검사: 현재는 1개의 에러가 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });    

  test('#1-7 수정 페이지에서 조회 페이지로 이동', async () => {
    // 이벤트: 사용자가 그룹수정 페이지에서 그룹조회 페이지로 이동
    store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
    // 검사: 현재 페이지 모드는 "읽기(DIRECTOR_GROUP_UPDATE)"이어야 합니다.
    expect(store.getters['directorGroupList/pageMode']).toBe(DIRECTOR_GROUP_READ);
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });
});

describe('#2 [Vuex.store]디렉터 그룹 추가/수정', () => {
  test('#2-1-1 새로운 디렉터 그룹 이름 필드에 유효하지 않은 이름(undefined) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효하지 않은 이름(undefined)로 입력. 예외 발생.
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: undefined,
    });
    // 검사: 현재는 에러가 1개 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });

  test('#2-1-2 새로운 디렉터 그룹 이름 필드에 유효하지 않은 이름(null) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효하지 않은 이름(undefined)로 입력. 예외 발생.
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: null,
    });
    // 검사: 현재는 에러가 1개 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });  

  test('#2-1-3 새로운 디렉터 그룹 이름 필드에 유효하지 않은 이름(2자 미만) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효하지 않은 이름(undefined)로 입력. 예외 발생.
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: '한',
    });
    // 검사: 현재는 에러가 1개 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });

  test('#2-1-4 새로운 디렉터 그룹 이름 필드에 유효하지 않은 이름(10자 초과) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효하지 않은 이름(undefined)로 입력. 예외 발생.
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: '12345678901',
    });
    // 검사: 현재는 에러가 1개 있어야 합니다.
    expect(store.getters['error/errors'].length).toBe(1);
    // 초기화: 다음 테스트를 위해 에러 상태를 초기화함
    store.dispatch('error/clearErrors');
  });  

  test('#2-2-1 새로운 디렉터 그룹 이름 필드에 유효한 이름(2자) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효한 이름(2자)로 입력
    const input = '강남';
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: input,
    });
    // 검사: directorGroup의 이름 확인
    const { name: nameFromStore } = store.getters['directorGroupList/directorGroup'];
    expect(nameFromStore).toBe(input);
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 초기화: 다음 테스트를 위해 directorGroup 데이터를 삭제
    store.dispatch('directorGroupList/clearDirectorGroup');
    const { name: nameEmptyFromStore } = store.getters['directorGroupList/directorGroup'];
    expect(nameEmptyFromStore).toBe('');
  });

  test('#2-2-2 새로운 디렉터 그룹 이름 필드에 유효한 이름(10자) 입력', async () => {
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 이벤트: 사용자가 디렉터 그룹 이름을 유효한 이름(10자)로 입력
    const input = '경기북부의정부그룹1';
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: input,
    });
    // 검사: directorGroup의 이름 확인
    const { name: nameFromStore } = store.getters['directorGroupList/directorGroup'];
    expect(nameFromStore).toBe(input);
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 초기화: 다음 테스트를 위해 directorGroup 데이터를 삭제
    store.dispatch('directorGroupList/clearDirectorGroup');
    const { name: nameEmptyFromStore } = store.getters['directorGroupList/directorGroup'];
    expect(nameEmptyFromStore).toBe('');
  });  

  test('#2-6 유효한 이름 입력, 지역그룹 1개 선택, 디렉터 1명 선택', async () => {
    // 이벤트: 사용자가 디렉터 그룹 이름, 지역그룹id를 입력
    const input = '경기북부의정부그룹1';
    const basePhysicalGroupIds = [uuidv4()];
    const directorIds = [uuidv4()];
    store.dispatch('directorGroupList/setDirectorGroup', {
      name: input,
      basePhysicalGroupIds,
      directorIds,
    });
    // 검사: 현재는 에러가 없어야 합니다.
    expect(store.getters['error/errors'].length).toBe(0);
    // 검사: directorGroup의 이름 확인
    const { 
      name: nameFromStore,
      basePhysicalGroupIds: basePhysicalGroupIdsFromStore,
      directorIds: directorIdsFromStore,
    } = store.getters['directorGroupList/directorGroup'];
    expect(nameFromStore).toBe(input);
    expect(basePhysicalGroupIds[0]).toBe(basePhysicalGroupIdsFromStore[0]);
    expect(directorIds[0]).toBe(directorIdsFromStore[0]);
    // 초기화: 다음 테스트를 위해 directorGroup 데이터를 삭제
    store.dispatch('directorGroupList/clearDirectorGroup');
  });
});

xdescribe('#4 [Vuex.store] 생성/수정 페이지 모드에서 입력한 데이터를 저장하지 않고 조회 페이지로 이동할 수 없다. 이 경우, 예외를 던져야 함.', () => {
  test('#4-1 ?', async () => {
    expect(true).toBeFalsy();
  });  
});

xdescribe('#5 [Vuex.store] 생성/수정 페이지 모드에서 입력한 데이터를 모두 삭제하면 조회 페이지로 이동할 수 있다.', () => {
  test('#5-1 ?', async () => {
    expect(true).toBeFalsy();
  });  
});

xdescribe('#6 [Vue.component]조회, 수정 페이지에서 검색키워드로 필터링된 결과만 보여져야 함', () => {
  test('#6-1 ?', async () => {
    expect(true).toBeFalsy();
  });  
});

xdescribe('#7 [Vue.component]생성/수정 페이지에서 입력된 데이터가 있는 상태에서 조회페이지로 이동', () => {
  test('#7-1 ?', async () => {
    expect(true).toBeFalsy();
  });  
});