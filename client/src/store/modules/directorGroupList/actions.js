import services from '@/services';
import {
  DIRECTOR_GROUP_LIST__SET_LIST,
  DIRECTOR_GROUP_LIST__SET_TOTAL_CNT,
  DIRECTOR_GROUP_LIST__SET_QUERY,
  DIRECTOR_GROUP_LIST__SET_PAGINATION,
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP,
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP_SEARCH_KEYWORD,
  DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST,
  DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST_SEARCH_KEYWORD,
  DIRECTOR_GROUP_LIST__SET_PAGE_MODE,
  DIRECTOR_GROUP_LIST__CLEAR_DIRECTOR_GROUP,
  DIRECTOR_GROUP_LIST__SET_DIRECTOR_LIST,
} from '@/store/mutationTypes';
import {
  DIRECTOR_GROUP__PAGE_MODE,
  DIRECTOR_GROUP__PAGE_MODE_SET,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';
import utils from '@/lib/utils';

export default {
  async fetchList({ commit, state, dispatch }) {
    const {
      query,
      pagination,
    } = state;

    try {
      const result = await services.graphql.directorGroup.fetchList({
        query,
        pagination,
      });
      const { count, rows } = result;
      commit(DIRECTOR_GROUP_LIST__SET_LIST, { list: rows });
      commit(DIRECTOR_GROUP_LIST__SET_TOTAL_CNT, { totalCnt: count });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  setTotalCnt({ commit }, { totalCnt }) {
    commit(DIRECTOR_GROUP_LIST__SET_TOTAL_CNT, { totalCnt });
  },
  setQuery({ commit }, { query }) {
    commit(DIRECTOR_GROUP_LIST__SET_QUERY, { query });
  },
  setPagination({ commit }, { pagination }) {
    const {
      currentPage,
      limit,
    } = pagination;

    commit(DIRECTOR_GROUP_LIST__SET_PAGINATION, {
      pagination: {
        currentPage,
        limit,
      },
    });
  },
  setDirectorGroup({ commit, dispatch }, {
    directorGroupId,
    name,
    basePhysicalGroupIds,
    directorIds,
  }) {
    if (!utils.isValidDirectorGroupName(name)) {
      const error = new Error(`name:${name} ${i18n.t('common.error.notValidValue')}`);
      dispatch('error/addError', error, { root: true });
      return;
    }

    commit(DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP, {
      directorGroupId,
      name,
      basePhysicalGroupIds,
      directorIds,
    });
  },
  setDirectorGroupSearchKeyword({ commit }, { searchKeyword }) {
    commit(DIRECTOR_GROUP_LIST__SET_DIRECTOR_GROUP_SEARCH_KEYWORD, {
      searchKeyword,
    });
  },
  async fetchPhysicalGroupList({ commit, dispatch }) {
    try {
      // eslint-disable-next-line max-len
      const result = await services.graphql.physicalGroup.fetchPhysicalGroupsInDirectorGroupList({});
      const { physicalGroups } = result;
      commit(DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST, { list: physicalGroups });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  setPhysicalGroupListSearchKeyword({ commit }, { searchKeyword }) {
    commit(DIRECTOR_GROUP_LIST__SET_PHYSICAL_GROUP_LIST_SEARCH_KEYWORD, {
      searchKeyword,
    });
  },
  setPageMode({ commit, dispatch, state }, { pageMode: nextPageMode }) {
    if (!DIRECTOR_GROUP__PAGE_MODE_SET.has(nextPageMode)) {
      const error = new Error(`nextPageMode:${nextPageMode} ${i18n.t('common.error.notValidValue')}`);
      dispatch('error/addError', error, { root: true });
      return;
    }

    const {
      DIRECTOR_GROUP_READ,
      DIRECTOR_GROUP_CREATE,
      DIRECTOR_GROUP_UPDATE,
    } = DIRECTOR_GROUP__PAGE_MODE;

    const { pageMode: prevPageMode } = state;
    // eslint-disable-next-line max-len
    if (prevPageMode === DIRECTOR_GROUP_READ && (nextPageMode !== DIRECTOR_GROUP_CREATE && nextPageMode !== DIRECTOR_GROUP_UPDATE)) {
      const error = new Error(`prevPageMode:${prevPageMode} & nextPageMode:${nextPageMode} ${i18n.t('common.error.notValidValue')}`);
      dispatch('error/addError', error, { root: true });
      return;
    }
    // eslint-disable-next-line max-len
    if ((prevPageMode === DIRECTOR_GROUP_CREATE || prevPageMode === DIRECTOR_GROUP_UPDATE) && nextPageMode !== DIRECTOR_GROUP_READ) {
      const error = new Error(`prevPageMode:${prevPageMode} & nextPageMode:${nextPageMode} ${i18n.t('common.error.notValidValue')}`);
      dispatch('error/addError', error, { root: true });
      return;
    }

    commit(DIRECTOR_GROUP_LIST__SET_PAGE_MODE, {
      pageMode: nextPageMode,
    });
  },
  async fetchDirectorList({ commit, dispatch }) {
    try {
      const result = await services.graphql.director.fetchList({
        pagination: {
          currentPage: 1,
          limit: 1000,
        },
      });
      const { rows } = result;
      commit(DIRECTOR_GROUP_LIST__SET_DIRECTOR_LIST, { list: rows });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  async createDirectorGroup({ commit, dispatch, getters }, { directorGroup }) {
    try {
      const {
        name,
        basePhysicalGroupIds,
        directorIds,
      } = directorGroup;
      const result = await services.graphql.directorGroup.createDirectorGroup({
        name,
        directorIds,
        basePhysicalGroupIds,
      });
      if (!result.directorCount) {
        result.directorCount = result.DirectorGroupDirectors.length;
      }
      const list = [
        ...getters.list,
        result,
      ];
      commit(DIRECTOR_GROUP_LIST__SET_LIST, { list });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  async updateDirectorGroup({ commit, dispatch, getters }, { directorGroup }) {
    try {
      const {
        directorGroupId,
        name,
        basePhysicalGroupIds,
        directorIds,
      } = directorGroup;
      const result = await services.graphql.directorGroup.updateDirectorGroup({
        name,
        directorIds,
        basePhysicalGroupIds,
      }, directorGroupId);
      if (!result.directorCount) {
        result.directorCount = result.DirectorGroupDirectors.length;
      }
      const list = getters.list.map((v) => {
        if (result.directorGroupId === v.directorGroupId) {
          return result;
        }
        return v;
      });
      commit(DIRECTOR_GROUP_LIST__SET_LIST, { list });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }
  },
  clearDirectorGroup({ commit }) {
    commit(DIRECTOR_GROUP_LIST__CLEAR_DIRECTOR_GROUP);
  },
};
