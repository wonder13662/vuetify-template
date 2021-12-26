<template>
  <BaseNaverMap
    :map-id="'sub-delivery-map'"
    :height="'100vh'"
    :width="'100%'"
    :draggable="true"
    :scroll-wheel="true"
    :hexagon-groups="hexagonGroups"
    :bound="bound"
  />
</template>

<script>
import store from '@/store';
import naverMapUtil from '@/lib/naverMap/naverMapUtil';
import BaseNaverMap from '@/components/base/BaseNaverMap';

export default {
  name: 'PhysicalGroupMapView',
  components: {
    BaseNaverMap,
  },
  props: {
    physicalGroups: {
      type: Array,
      default: () => ([]),
    },
    physicalGroupFocus: {
      type: String,
      default: '',
    },
    physicalGroupClick: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hexagonGroups: [],
      bound: null,
    };
  },
  watch: {
    physicalGroups(val) {
      this.hexagonGroups = this.getHexagonGroups(val);
      this.bound = this.getBound(this.hexagonGroups);
    },
    physicalGroupFocus(val) {
      if (!val) {
        this.blurPhysicalGroups();
      } else {
        this.focusPhysicalGroup(val);
      }
    },
    physicalGroupClick(val) {
      if (!val) {
        return;
      }
      const found = this.hexagonGroups.find((v) => v.meta.physicalGroupId === val);
      if (!found) {
        return;
      }
      this.bound = this.getBound([found]);
    },
  },
  methods: {
    focusPhysicalGroup(physicalGroupId) {
      // eslint-disable-next-line max-len
      const found = this.hexagonGroups.find((v) => v.meta.physicalGroupId === physicalGroupId);
      if (found) {
        found.focus();
      }
    },
    blurPhysicalGroups() {
      this.hexagonGroups.forEach((v) => v.blur());
    },
    onEventTriggeredHexagonGroup({ event, meta }) {
      const { physicalGroupId } = meta;
      if (event === 'mouseover') {
        store.dispatch('physicalGroup/focusPhysicalGroup', { physicalGroupId });
      } else if (event === 'mouseout') {
        store.dispatch('physicalGroup/blurPhysicalGroup');
      } else if (event === 'click') {
        store.dispatch('physicalGroup/setPhysicalGroupClick', { physicalGroupId });
      }
    },
    getHexagonGroups(physicalGroups) {
      return physicalGroups.map((v) => {
        const {
          PhysicalGroupH3Polygons,
          name: physicalGroupName,
          physicalGroupId,
        } = v;
        const h3Indexes = PhysicalGroupH3Polygons.map((item) => (item.H3Polygon.h3Index));

        return naverMapUtil.createPhysicalGroup({
          h3Indexes,
          physicalGroupName,
          driverCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
          deliveryCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
          meta: {
            physicalGroupId,
          },
          eventListener: this.onEventTriggeredHexagonGroup,
        });
      });
    },
    getBound(hexagonGroups) {
      const bounds = hexagonGroups.map((v) => v.getBound());
      const mergedBound = bounds.reduce((acc, v) => {
        if (!acc) {
          return v;
        }
        return acc.merge(v);
      }, null);
      return mergedBound;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
