import {
  DIRECTOR_GROUP__PAGE_MODE,
} from '@/lib/constants';

export default {
  list(state) {
    return Object.values(state.map);
  },
  totalCnt(state) {
    return state.totalCnt;
  },
  query(state) {
    return state.query;
  },
  pagination(state) {
    return state.pagination;
  },
  pageMode(state) {
    return state.pageMode;
  },
  pageModeRead() {
    return DIRECTOR_GROUP__PAGE_MODE.DIRECTOR_GROUP_READ;
  },
  directorGroupEmpty() {
    return {
      directorGroupId: '',
      name: '',
      basePhysicalGroupIds: [],
      directorIds: [],
    };
  },
  directorGroup(state) {
    return state.directorGroup;
  },
  directorGroupListSearchKeyword(state) {
    return state.directorGroupListSearchKeyword;
  },
  physicalGroupList(state) {
    return state.physicalGroupList;
  },
  physicalGroupListSearchKeyword(state) {
    return state.physicalGroupListSearchKeyword;
  },
  directorList(state) {
    return state.directorList;
  },
};
