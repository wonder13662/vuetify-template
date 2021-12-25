export default {
  PHYSICAL_GROUP__SET_PHYSICAL_GROUPS(state, { physicalGroups }) {
    state.physicalGroups = physicalGroups;
  },
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_LIST_ITEMS(state, { physicalGroupListItems }) {
    state.physicalGroupListItems = physicalGroupListItems;
  },
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_SEARCH_KEYWORD(state, { searchKeyword }) {
    state.physicalGroupSearchKeyword = searchKeyword;
  },
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_FOCUS(state, { physicalGroupId }) {
    state.physicalGroupIdFocus = physicalGroupId;
  },
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_BLUR(state) {
    state.physicalGroupIdFocus = null;
  },
  PHYSICAL_GROUP__SET_PHYSICAL_GROUP_CLICK(state, { physicalGroupId }) {
    state.physicalGroupIdClick = physicalGroupId;
  },
};
