<template>
  <BaseNaverMap
    :map-id="'sub-delivery-map'"
    :draggable="true"
    :scroll-wheel="true"
    :hexagon-groups="hexagonGroups"
    :bound="bound"
  />
</template>

<script>
// TODO 내부에 빈 공간이 있는 것을 표현할 수 있어야 함

// https://h3geo.org/docs/api/indexing#h3togeoboundary -> 외곽을 따는 기능

import BaseNaverMap from '@/components/base/BaseNaverMapV2';
import sample from '@/assets/h3/sample.json';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';

export default {
  name: 'H3MapView',
  components: {
    BaseNaverMap,
  },
  computed: {
    hexagonGroups() {
      const { directorGroups } = sample;
      const { DirectorGroupPhysicalGroups } = directorGroups[0];
      const physicalGroups = [...DirectorGroupPhysicalGroups].map((v) => {
        const {
          name,
          physicalGroupId,
          type,
          PhysicalGroupH3Polygons,
        } = v.PhysicalGroup;
        const h3Indexes = PhysicalGroupH3Polygons.map((p) => (p.H3Polygon.h3Index));
        return {
          name,
          physicalGroupId,
          type,
          h3Indexes,
        };
      });

      return physicalGroups.map((v) => (hexagonGroupHandler.createHexagonGroup({
        hexagonGroupName: v.name,
        h3Indexes: v.h3Indexes,
        driverCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
        subDeliveryCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
      })));
    },
    bound() {
      return hexagonGroupHandler.getBound(this.hexagonGroups);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
