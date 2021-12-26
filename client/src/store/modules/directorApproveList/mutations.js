import Vue from 'vue';

export default {
  DIRECTOR_APPROVE_LIST__SET_LIST(state, { list }) {
    state.map = {};
    list.forEach((v) => {
      Vue.set(state.map, v.serviceUserId, v);
    });
  },
  DIRECTOR_APPROVE_LIST__SET_TOTAL_CNT(state, { totalCnt }) {
    if (totalCnt >= 0) {
      state.totalCnt = totalCnt;
    }
  },
  DIRECTOR_APPROVE_LIST__SET_QUERY(state, { query }) {
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
  DIRECTOR_APPROVE_LIST__SET_PAGINATION(state, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    state.pagination = {
      currentPage,
      limit,
    };
  },
  DIRECTOR_APPROVE_LIST__APPROVE_DIRECTOR(state, { serviceUserId }) {
    Vue.delete(state.map, serviceUserId);
  },
  DIRECTOR_APPROVE_LIST__REJECT_DIRECTOR(state, { serviceUserId }) {
    Vue.delete(state.map, serviceUserId);
  },
};
