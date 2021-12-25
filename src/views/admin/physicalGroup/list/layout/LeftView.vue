<template>
  <MapView
    :physical-groups="physicalGroups"
    :physical-group-focus="physicalGroupFocus"
    :physical-group-click="physicalGroupClick"
  />
</template>

<script>
import store from '@/store';
import MapView from '../../components/MapView';

export default {
  name: 'PhysicalGroupListLayoutLeftView',
  components: {
    MapView,
  },
  computed: {
    physicalGroups() {
      return store.getters['physicalGroup/physicalGroups'];
    },
    physicalGroupFocus() {
      return store.getters['physicalGroup/physicalGroupFocus'];
    },
    physicalGroupClick() {
      return store.getters['physicalGroup/physicalGroupClick'];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
