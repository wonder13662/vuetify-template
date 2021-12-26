import Vue from 'vue';

export default {
  DRIVER_APPROVE_LIST__SET_LIST(state, { list }) {
    state.map = {};
    list.forEach((v) => {
      Vue.set(state.map, v.serviceUserId, v);
    });
  },
  DRIVER_APPROVE_LIST__SET_TOTAL_CNT(state, { totalCnt }) {
    if (totalCnt >= 0) {
      state.totalCnt = totalCnt;
    }
  },
  DRIVER_APPROVE_LIST__SET_QUERY(state, { query }) {
    const {
      name,
      approveStatus,
    } = query;

    state.query = {
      name,
      approveStatus,
    };
  },
  DRIVER_APPROVE_LIST__SET_PAGINATION(state, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    state.pagination = {
      currentPage,
      limit,
    };
  },
  DRIVER_APPROVE_LIST__APPROVE_DRIVER(state, { serviceUserId }) {
    Vue.delete(state.map, serviceUserId);
  },
  DRIVER_APPROVE_LIST__REJECT_DRIVER(state, { serviceUserId }) {
    Vue.delete(state.map, serviceUserId);
  },
};
