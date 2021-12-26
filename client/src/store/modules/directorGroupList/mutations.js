import Vue from 'vue';
import getters from './getters';

export default {
  DIRECTOR_GROUP_LIST__SET_LIST(state, { list }) {
    state.map = {};
    list.forEach((v) => {
      Vue.set(state.map, v.directorGroupId, v);
    });
  },
  DIRECTOR_GROUP_LIST__SET_TOTAL_CNT(state, { totalCnt }) {
    if (totalCnt >= 0) {
      state.totalCnt = totalCnt;
    }
  },
  DIRECTOR_GROUP_LIST__SET_QUERY(state, { query }) {
    const {
      name,
      email,
      approveStatus, // TODO 승인상태 유효성 검증
    } = query;

    state.query = {
      name,
      email,
      approveStatus,
    };
  },
  DIRECTOR_GROUP_LIST__SET_PAGINATION(state, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    state.pagination = {
      currentPage,
      limit,
    };
  },
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP(state, {
    directorGroupId,
    name,
    basePhysicalGroupIds,
    directorIds,
  }) {
    state.directorGroup = {
      directorGroupId,
      name,
      basePhysicalGroupIds,
      directorIds,
    };
  },
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP_SEARCH_KEYWORD(state, { searchKeyword }) {
    state.directorGroupListSearchKeyword = searchKeyword;
  },
  DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST(state, { list }) {
    state.physicalGroupList = list;
  },
  DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST_SEARCH_KEYWORD(state, { searchKeyword }) {
    state.physicalGroupListSearchKeyword = searchKeyword;
  },
  DIRECTOR_GROUP_LIST__SET_PAGE_MODE(state, { pageMode }) {
    state.pageMode = pageMode;
  },
  DIRECTOR_GROUP_LIST__CLEAR_DIRECTOR_GROUP(state) {
    state.directorGroup = getters.directorGroupEmpty();
    state.physicalGroupListSearchKeyword = '';
  },
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_LIST(state, { list }) {
    state.directorList = list;
  },
};
