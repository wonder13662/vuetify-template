import services from '@/services';
import {
  DIRECTOR_APPROVE_LIST__SET_LIST,
  DIRECTOR_APPROVE_LIST__SET_TOTAL_CNT,
  DIRECTOR_APPROVE_LIST__SET_QUERY,
  DIRECTOR_APPROVE_LIST__SET_PAGINATION,
  DIRECTOR_APPROVE_LIST__APPROVE_DIRECTOR,
  DIRECTOR_APPROVE_LIST__REJECT_DIRECTOR,
} from '@/store/mutationTypes';
import utils from '@/lib/utils';
import i18n from '@/plugins/vueI18n';

export default {
  async fetchList({ commit, state, dispatch }, { query = {}, pagination = {} }) {
    const mergedQuery = {
      ...state.query,
      ...query,
    };

    const mergedPagination = {
      ...state.pagination,
      ...pagination,
    };

    try {
      const result = await services.graphql.director.fetchList({
        query: mergedQuery,
        pagination: mergedPagination,
      });
      const { count, rows } = result;
      commit(DIRECTOR_APPROVE_LIST__SET_LIST, { list: rows });
      commit(DIRECTOR_APPROVE_LIST__SET_TOTAL_CNT, { totalCnt: count });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  setTotalCnt({ commit }, { totalCnt }) {
    commit(DIRECTOR_APPROVE_LIST__SET_TOTAL_CNT, { totalCnt });
  },
  setQuery({ commit }, { query }) {
    commit(DIRECTOR_APPROVE_LIST__SET_QUERY, { query });
  },
  setPagination({ commit }, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    commit(DIRECTOR_APPROVE_LIST__SET_PAGINATION, {
      pagination: {
        currentPage,
        limit,
      },
    });
  },
  async approveDirector({ commit, dispatch }, { serviceUserId }) {
    try {
      // TODO #1427 대기 > 거절 또는 거절 > 승인을 하는 시점에 관련 이력을 메모에 남기는 기능이 필요
      const result = await services.graphql.director.approveDirector(serviceUserId);
      if (!result && !utils.isUUIDType(result.serviceUserId)) {
        throw new Error(`serviceUserId:(${result.serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }

      commit(DIRECTOR_APPROVE_LIST__APPROVE_DIRECTOR, { serviceUserId });
      const alertMessage = i18n.t('views.admin.director.directorApproveList.alertSuccessApproveDirector');
      dispatch('alert/addAlertSuccess', { message: alertMessage }, { root: true });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
      const alertMessage = i18n.t('views.admin.director.directorApproveList.alertFailApproveDirector');
      dispatch('alert/addAlertError', { message: alertMessage }, { root: true });
    }
  },
  async rejectDirector({ commit, dispatch }, { serviceUserId, memo }) {
    try {
      const result = await services.graphql.director.rejectDirector(serviceUserId, memo);
      if (!result && !utils.isUUIDType(result.serviceUserId)) {
        throw new Error(`serviceUserId:(${result.serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }

      commit(DIRECTOR_APPROVE_LIST__REJECT_DIRECTOR, { serviceUserId });
      const alertMessage = i18n.t('views.admin.director.directorApproveList.alertSuccessRejectDirector');
      dispatch('alert/addAlertSuccess', { message: alertMessage }, { root: true });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
      const alertMessage = i18n.t('views.admin.director.directorApproveList.alertFailRejectDirector');
      dispatch('alert/addAlertError', { message: alertMessage }, { root: true });
    }
  },
};
