import getters from './getters';

export default () => ({
  map: {},
  totalCnt: 0,
  query: {
    name: '',
  },
  pagination: {
    currentPage: 1,
    limit: 10,
  },
  pageMode: getters.pageModeRead(),
  directorGroup: getters.directorGroupEmpty(),
  directorGroupListSearchKeyword: '',
  physicalGroupList: [],
  physicalGroupListSearchKeyword: '',
  directorList: [],
});
