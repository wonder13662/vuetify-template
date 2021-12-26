<template>
  <v-card elevation="0">
    <v-list class="pa-0">
      <BaseListItemDense>
        <BaseListItemLabelSlot
          :label="$t('views.physicalGroup.physicalGroupList.topBar.label')"
        >
          <v-btn
            outlined
            small
            @click="addNewPhysicalGroup"
          >
            {{ $t('views.physicalGroup.physicalGroupList.topBar.btnAddNewPhysicalGroup') }}
          </v-btn>
        </BaseListItemLabelSlot>
      </BaseListItemDense>
      <BaseListItemDense>
        <BaseListItemLabelSlot
          :label="`총 ${itemCount}개`"
        >
          <v-text-field
            dense
            outlined
            prepend-inner-icon="mdi-magnify"
            hide-details="auto"
            :placeholder="$t('views.physicalGroup.physicalGroupList.topBar.searchPhysicalGroup')"
            @input="searchPhysicalGroup"
          />
        </BaseListItemLabelSlot>
      </BaseListItemDense>
    </v-list>
  </v-card>
</template>

<script>
import store from '@/store';
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemLabelSlot from '@/components/base/BaseListItemLabelSlot';

export default {
  name: 'PhysicalGroupListTopBar',
  components: {
    BaseListItemDense,
    BaseListItemLabelSlot,
  },
  props: {
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    addNewPhysicalGroup() {
      // eslint-disable-next-line no-console
      console.log('addNewPhysicalGroup');
    },
    searchPhysicalGroup(input) {
      store.dispatch('physicalGroup/setSearchKeyword', { searchKeyword: input });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
