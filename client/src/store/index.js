import Vue from 'vue';
import Vuex from 'vuex';
import alert from './modules/alert';
import auth from './modules/auth';
import driverApproveList from './modules/driverApproveList';
import directorApproveList from './modules/directorApproveList';
import directorGroupList from './modules/directorGroupList';
import directorList from './modules/directorList';
import error from './modules/error';
import physicalGroup from './modules/physicalGroup';

Vue.use(Vuex);

const store = new Vuex.Store({
  // https://vuex.vuejs.org/guide/strict.html#strict-mode
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    alert,
    auth,
    driverApproveList,
    directorApproveList,
    directorGroupList,
    directorList,
    error,
    physicalGroup,
  },
});

export default store;
