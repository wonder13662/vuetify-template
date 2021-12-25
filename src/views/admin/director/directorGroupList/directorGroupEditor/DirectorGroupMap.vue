<template>
  <BaseNaverMap
    :map-id="'sub-delivery-map'"
    :draggable="true"
    :scroll-wheel="true"
    :hexagon-groups="hexagonGroups"
    :bound="bounds"
  />
</template>

<script>
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import BaseNaverMap from '@/components/base/BaseNaverMapV2';

export default {
  name: 'DirectorGroupMap',
  components: {
    BaseNaverMap,
  },
  props: {
    hexagonGroups: {
      type: Array,
      required: true,
    },
  },
  computed: {
    bounds() {
      return hexagonGroupHandler.getBound(this.hexagonGroups);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
