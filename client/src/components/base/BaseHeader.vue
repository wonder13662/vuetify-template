<template>
  <BaseContentHorizontalEvenLayout
    :items="names"
    :style="{ background: background }"
  >
    <template v-slot:item="{ item }">
      <BaseText
        :text="`${item}`"
        :bold="true"
        :center="true"
      />
    </template>
  </BaseContentHorizontalEvenLayout>
</template>

<script>
import BaseContentHorizontalEvenLayout from '@/components/base/BaseContentHorizontalEvenLayout';
import BaseText from '@/components/base/BaseText';

export default {
  name: 'BaseHeader',
  components: {
    BaseContentHorizontalEvenLayout,
    BaseText,
  },
  props: {
    names: {
      type: Array,
      required: true,
    },
    background: {
      type: String,
      default: '#eee',
    },
  },
  computed: {
    cols() {
      return 12 / this.names.length;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
