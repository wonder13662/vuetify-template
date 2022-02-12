<template>
  <div>
    H3 Polygon Selector
  </div>
</template>

<script>
/*
  H3 Polygon Selector
  - 수정모드(추가)
    - 만들어진 영엑의 모든 H3Index가 추가된다.
    - H3Index들로 표시되는 영역은 떨어져 있을 수 있다.
    - 지도 표시는 h3.polyfill로 처리한다.
  - 수정모드(삭제)
    - 만들어진 영역의 모든 H3Index가 삭제된다.
    - 지도 표시는 h3.polyfill로 처리한다.
  - 수정모드:영역그리기
    - 영역의 포인트를 클릭하면 편집모드로 표시된다
    - 영역의 포인트를 편집모드 상태로 바꾸고 지도의 다른 위치를 클릭하면 포인트가 클릭 위치로 이동한다.(드래그는 기존 지도 이동 이벤트가 있으므로 사용하지말자)
    - 영역의 포인트는 삭제가 가능하다
    - 영역의 포인트를 잇슨 직선 사이에 좌표를 추가할 수 있다
    - 영역의 포인트는 Html 마커로 만들어 제어하자(Focus, Blur)
  - 읽기모드
    - 전체 영역에 대한 표시를 해준다
    - 마우스 이벤트는 전체 영역의 Focus, Blur 이벤트만을 처리한다.
*/
export default {
  name: 'H3PolygonSelector',
};
</script>

<style lang="scss" scoped>

</style>
