<template>
  <v-virtual-scroll
    :items="list"
    :item-height="41"
    class="container"
    bench="10"
  >
    <template v-slot:default="{ item }">
      <PhysicalGroupListItem
        :item="item"
      />
    </template>
  </v-virtual-scroll>
</template>

<script>
import PhysicalGroupListItem from './PhysicalGroupListItem';

export default {
  name: 'PhysicalGroupList',
  components: {
    PhysicalGroupListItem,
  },
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
