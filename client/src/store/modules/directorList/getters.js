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
};
