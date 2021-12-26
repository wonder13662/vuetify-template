import services from '@/services';
import {
  DRIVER_APPROVE_LIST__SET_LIST,
  DRIVER_APPROVE_LIST__SET_TOTAL_CNT,
  DRIVER_APPROVE_LIST__SET_QUERY,
  DRIVER_APPROVE_LIST__SET_PAGINATION,
  DRIVER_APPROVE_LIST__APPROVE_DRIVER,
  DRIVER_APPROVE_LIST__REJECT_DRIVER,
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
      const result = await services.graphql.driver.fetchList({
        query: mergedQuery,
        pagination: mergedPagination,
      });
      const { count, rows } = result;

      commit(DRIVER_APPROVE_LIST__SET_LIST, { list: rows });
      commit(DRIVER_APPROVE_LIST__SET_TOTAL_CNT, { totalCnt: count });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  setTotalCnt({ commit }, { totalCnt }) {
    commit(DRIVER_APPROVE_LIST__SET_TOTAL_CNT, { totalCnt });
  },
  setQuery({ commit }, { query }) {
    commit(DRIVER_APPROVE_LIST__SET_QUERY, { query });
  },
  setPagination({ commit }, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    commit(DRIVER_APPROVE_LIST__SET_PAGINATION, {
      pagination: {
        currentPage,
        limit,
      },
    });
  },
  async approveDriver({ commit, dispatch }, { serviceUserId }) {
    try {
      if (!utils.isUUIDType(serviceUserId)) {
        throw new Error(`param serviceUserId:(${serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }
      // TODO #1427 대기 > 거절 또는 거절 > 승인을 하는 시점에 관련 이력을 메모에 남기는 기능이 필요
      const result = await services.graphql.driver.approveDriver(serviceUserId);
      if (!result && !utils.isUUIDType(result.serviceUserId)) {
        throw new Error(`result serviceUserId:(${result.serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }

      commit(DRIVER_APPROVE_LIST__APPROVE_DRIVER, { serviceUserId });
      const alertMessage = i18n.t('views.admin.driver.driverApproveList.alertSuccessApproveDriver');
      dispatch('alert/addAlertSuccess', { message: alertMessage }, { root: true });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
      const alertMessage = i18n.t('views.admin.driver.driverApproveList.alertFailApproveDriver');
      dispatch('alert/addAlertError', { message: alertMessage }, { root: true });
    }
  },
  async rejectDriver({ commit, dispatch }, { serviceUserId, memo }) {
    try {
      if (!utils.isUUIDType(serviceUserId)) {
        throw new Error(`param serviceUserId:(${serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }
      const result = await services.graphql.driver.rejectDriver(serviceUserId, memo);
      if (!result && !utils.isUUIDType(result.serviceUserId)) {
        throw new Error(`result serviceUserId:(${result.serviceUserId}) ${i18n.t('common.error.notValid')}`);
      }

      commit(DRIVER_APPROVE_LIST__REJECT_DRIVER, { serviceUserId });
      const alertMessage = i18n.t('views.admin.driver.driverApproveList.alertSuccessRejectDriver');
      dispatch('alert/addAlertSuccess', { message: alertMessage }, { root: true });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
      const alertMessage = i18n.t('views.admin.driver.driverApproveList.alertFailRejectDriver');
      dispatch('alert/addAlertError', { message: alertMessage }, { root: true });
    }
  },
};
