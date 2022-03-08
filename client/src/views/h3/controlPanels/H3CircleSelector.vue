<template>
  <div>
    H3 Circle Selector
  </div>
</template>

<script>
/*
 H3 Circle Selector
 - 네이버 맵 위에 2개의 좌표를 선택. 첫번째 좌표는 원의 중심, 두번째 좌표는 원의 반지름이 됨.
 - 이 원안에 걸쳐있는 모든 H3Index를 표시
 - 원의 중심좌표로 설정된 H3 Resolution의 h3Index를 구함
 - 구한 첫번째 H3Index의 HexRing의 k-distance를 1로 주변 h3Index들을 가져옴
 - 원의 중심좌표로부터 주변 h3Index들의 꼭지점까지의 모든 거리가 원의 반지름보다 크다면 검사를 중단한다
 - h3Index 꼭지점 중 하나라도 원의 중심좌표와의 거리가 반지름보다 작다면 그 h3Index는 표시할 대상으로 등록한다
 - 사용자가 클릭한 2개의 좌표를 표시한다
 - 2개 좌표로 그린 원을 표시한다
 - 원안에 걸쳐있는 h3Index를 표시한다
*/
export default {
  name: 'H3CircleSelector',
};
</script>

<style lang="scss" scoped>

</style>
