import services from '@/services';
import {
  DIRECTOR_LIST__SET_LIST,
  DIRECTOR_LIST__SET_TOTAL_CNT,
  DIRECTOR_LIST__SET_PAGINATION,
  DIRECTOR_LIST__SET_QUERY,
} from '@/store/mutationTypes';
import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default {
  async fetchList({ commit, state, dispatch }) {
    const { query, pagination } = state;

    try {
      const result = await services.graphql.director.fetchList({
        query,
        pagination,
      });
      const { count, rows } = result;

      commit(DIRECTOR_LIST__SET_LIST, { list: rows });
      commit(DIRECTOR_LIST__SET_TOTAL_CNT, { totalCnt: count });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  setQuery({ commit }, { query }) {
    const {
      name = '',
      email = '',
      phoneNumber = '',
      approveStatusList = [
        SERVICEUSER_APPROVE_STATUS.WAIT,
        SERVICEUSER_APPROVE_STATUS.APPROVE,
        SERVICEUSER_APPROVE_STATUS.REJECT,
      ],
    } = query;

    commit(DIRECTOR_LIST__SET_QUERY, {
      query: {
        name,
        email,
        phoneNumber,
        approveStatusList,
      },
    });
  },
  setTotalCnt({ commit }, { totalCnt }) {
    commit(DIRECTOR_LIST__SET_TOTAL_CNT, { totalCnt });
  },
  setPagination({ commit }, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    commit(DIRECTOR_LIST__SET_PAGINATION, {
      pagination: {
        currentPage,
        limit,
      },
    });
  },
};
