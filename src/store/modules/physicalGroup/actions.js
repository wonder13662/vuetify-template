import services from '@/services';
import {
  PHYSICAL_GROUP__SET_PHYSICAL_GROUPS,
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_LIST_ITEMS,
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_SEARCH_KEYWORD,
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_FOCUS,
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_BLUR,
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_CLICK,
} from '@/store/mutationTypes';

export default {
  async fetchList({ commit, dispatch, state }, { name }) {
    try {
      const result = await services.graphql.physicalGroup.fetchPhysicalGroups({ name });
      commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUPS, { physicalGroups: result });
    } catch (error) {
      dispatch('error/addError', error, { root: true });
    }

    const physicalGroupListItems = state.physicalGroups.map((v) => {
      const maxNormalDriverCount = v.DispatchRoom ? v.DispatchRoom.maxNormalDriverCount : 0;
      const directorGroupIdCount = v.DirectorGroupPhysicalGroups.length;
      const h3PolygonCount = v.PhysicalGroupH3Polygons.length;

      return {
        physicalGroupId: v.physicalGroupId,
        name: v.name,
        maxNormalDriverCount,
        directorGroupIdCount,
        h3PolygonCount,
      };
    });
    commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUP_LIST_ITEMS, { physicalGroupListItems });
  },
  setSearchKeyword({ commit }, { searchKeyword }) {
    commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUP_SEARCH_KEYWORD, { searchKeyword });
  },
  focusPhysicalGroup({ commit }, { physicalGroupId }) {
    commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUP_FOCUS, { physicalGroupId });
  },
  blurPhysicalGroup({ commit }) {
    commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUP_BLUR);
  },
  setPhysicalGroupClick({ commit }, { physicalGroupId }) {
    commit(PHYSICAL_GROUP__SET_PHYSICAL_GROUP_CLICK, { physicalGroupId });
  },
};
