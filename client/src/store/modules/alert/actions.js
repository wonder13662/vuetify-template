import {
  ALERT__ADD_ALERT,
  ALERT__REMOVE_ALERT,
} from '@/store/mutationTypes';
import { ALERT_TYPE } from '@/lib/constants';
import utils from '@/lib/utils';
import i18n from '@/plugins/vueI18n';

export default {
  addAlertSuccess({ commit, dispatch }, { message }) {
    if (!message) {
      const errMsg = `addAlertSuccess:message:${message} - ${i18n.t('common.error.notValid')}`;
      dispatch('error/addError', { message: errMsg }, { root: true });
      return;
    }
    commit(ALERT__ADD_ALERT, { message, type: ALERT_TYPE.SUCCESS });
  },
  addAlertError({ commit, dispatch }, { message }) {
    if (!message) {
      const errMsg = `addAlertFail:message:${message} - ${i18n.t('common.error.notValid')}`;
      dispatch('error/addError', { message: errMsg }, { root: true });
      return;
    }
    commit(ALERT__ADD_ALERT, { message, type: ALERT_TYPE.ERROR });
  },
  removeAlert({ commit, dispatch }, { id }) {
    if (!utils.isUUIDType(id)) {
      const errMsg = `removeAlert:id:${id} - ${i18n.t('common.error.notValid')}`;
      dispatch('error/addError', { message: errMsg }, { root: true });
      return;
    }
    commit(ALERT__REMOVE_ALERT, { id });
  },
};
