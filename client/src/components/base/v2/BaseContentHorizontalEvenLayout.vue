<template>
  <BaseRow>
    <BaseCol
      v-for="(item, idx) in items"
      :key="idx"
      :cols="cols"
    >
      <slot
        name="item"
        :item="item"
      />
    </BaseCol>
  </BaseRow>
</template>

<script>
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';

export default {
  name: 'BaseContentHorizontalEvenLayout',
  components: {
    BaseRow,
    BaseCol,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    cols() {
      return Math.round(12 / this.items.length);
    },
  },
};
</script>
