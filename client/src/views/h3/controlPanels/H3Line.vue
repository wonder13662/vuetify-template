<template>
  <GeoToH3
    title="H3Line"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
  >
    <div>내부구현필요</div>
  </GeoToH3>
</template>

<script>
import GeoToH3 from './GeoToH3';
import mapUtils from '@/lib/naverMapV2/lib/utils';

// https://h3geo.org/docs/api/traversal/#h3line
// TODO 2개의 클릭 좌표를 받아야 함
// 현재는 클릭한 1개의 좌표만 받을 수 있음
// 사용자가 선택한 point에 좌표가 새로 들어오는 구조로 만들어보자
export default {
  name: 'H3Line',
  components: {
    GeoToH3,
  },
  props: {
    show: {
      type: Boolean,
    },
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onChange({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChangeH3Index({ h3Index }) {
      if (!mapUtils.h3IsValid(h3Index)) {
        return;
      }
      // eslint-disable-next-line no-console
      console.log('onChangeH3Index / h3Index:', h3Index);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
