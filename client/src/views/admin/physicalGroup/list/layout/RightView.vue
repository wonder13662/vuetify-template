<template>
  <div>
    <PhysicalGroupTopBar />
    <v-divider />
    <PhysicalGroupHeader />
    <v-divider />
    <PhysicalGroupList :list="list" />
  </div>
</template>

<script>
import store from '@/store';
import PhysicalGroupList from '../components/PhysicalGroupList';
import PhysicalGroupHeader from '../components/PhysicalGroupListHeader';
import PhysicalGroupTopBar from '../components/PhysicalGroupListTopBar';

export default {
  name: 'PhysicalGroupListLayoutRightView',
  components: {
    PhysicalGroupList,
    PhysicalGroupHeader,
    PhysicalGroupTopBar,
  },
  computed: {
    list() {
      const searchKeyword = store.getters['physicalGroup/physicalGroupSearchKeyword'];
      const list = store.getters['physicalGroup/physicalGroupListItems'];
      return list.filter((v) => v.name.indexOf(searchKeyword) > -1);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
