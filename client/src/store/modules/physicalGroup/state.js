export default () => ({
  // 지도에 표시되는 지역그룹(Physical group)들의 배열
  physicalGroups: [],
  // 지역그룹 리스트에 표시될 아이템들
  physicalGroupListItems: [],
  // 지도 혹은 리스트에서 사용자가 mouseover한 지역그룹의 ID
  physicalGroupIdFocus: null,
  // 지도 혹은 리스트에서 사용자가 click한 지역그룹의 ID
  physicalGroupIdClick: null,
  // 지역그룹 리스트를 검색할 키워드
  physicalGroupSearchKeyword: '',
  // 지도에서 선택할 수 있는 h3Index들의 배열
  selectableH3Indexes: [],
});
