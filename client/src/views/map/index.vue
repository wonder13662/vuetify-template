<template>
  <div>
    <BaseNaverMap
      :map-id="'map-sample'"
    />
  </div>
</template>

<script>
import BaseNaverMap from '@/components/base/v1/BaseNaverMapV2';
/*
H3 Api의 기능을 네이버 맵 위에 표시합니다.
*/
export default {
  name: 'Map',
  components: {
    BaseNaverMap,
  },
};
</script>

<style lang="scss" scoped>

</style>
