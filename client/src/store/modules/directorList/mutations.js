import Vue from 'vue';

export default {
  DIRECTOR_LIST__SET_LIST(state, { list }) {
    state.map = {};
    list.forEach((v) => {
      Vue.set(state.map, v.serviceUserId, v);
    });
  },
  DIRECTOR_LIST__SET_TOTAL_CNT(state, { totalCnt }) {
    if (totalCnt >= 0) {
      state.totalCnt = totalCnt;
    }
  },
  DIRECTOR_LIST__SET_QUERY(state, { query }) {
    const {
      name,
      email,
      phoneNumber,
      approveStatusList,
    } = query;

    state.query = {
      name,
      email,
      phoneNumber,
      approveStatusList,
    };
  },
  DIRECTOR_LIST__SET_PAGINATION(state, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    state.pagination = {
      currentPage,
      limit,
    };
  },
};
