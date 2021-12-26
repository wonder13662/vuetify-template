<template>
  <div
    :class="rowClassObject"
    @click="onClickRow(item)"
    @mouseenter="onMouseenterRow(item)"
    @mouseleave="onMouseleaveRow()"
  >
    <BaseRow>
      <BaseCol :cols="3">
        {{ item.name }}
      </BaseCol>
      <BaseCol
        :cols="3"
        class="text-right"
      >
        {{ item.maxNormalDriverCount }}
      </BaseCol>
      <BaseCol
        :cols="3"
        class="text-right"
      >
        {{ item.directorGroupIdCount }}
      </BaseCol>
      <BaseCol
        :cols="3"
        class="text-right"
      >
        <v-btn
          small
          outlined
          @click="onClickEditPhysicalGroup(item)"
        >
          {{ "수정" }}
        </v-btn>
      </BaseCol>
    </BaseRow>
    <v-divider />
  </div>
</template>

<script>
import store from '@/store';
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';

export default {
  name: 'PhysicalGroupListItem',
  components: {
    BaseRow,
    BaseCol,
  },
  props: {
    item: {
      type: Object,
      required: true,
      validator(v) {
        return !!v;
      },
    },
  },
  computed: {
    rowClassObject() {
      const physicalGroupId = store.getters['physicalGroup/physicalGroupFocus'];
      if (this.item.physicalGroupId === physicalGroupId) {
        const isFocus = !!store.getters['physicalGroup/physicalGroupFocus'];
        return {
          'physical-group-list__item-row__focus': isFocus,
        };
      }
      return {};
    },
  },
  methods: {
    onClickEditPhysicalGroup(item) {
      // eslint-disable-next-line no-console
      console.log('onClickEditPhysicalGroup / item:', item);
    },
    onClickRow(item) {
      const { physicalGroupId } = item;
      store.dispatch('physicalGroup/setPhysicalGroupClick', { physicalGroupId });
    },
    onMouseenterRow(item) {
      const { physicalGroupId } = item;
      store.dispatch('physicalGroup/focusPhysicalGroup', { physicalGroupId });
    },
    onMouseleaveRow() {
      store.dispatch('physicalGroup/blurPhysicalGroup');
    },
  },

};
</script>

<style lang="scss" scoped>
.physical-group-list__item-row__focus {
  background-color: #eee;
}
</style>
