<template>
  <BaseContentHorizontalEvenLayout
    :items="names"
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
import BaseContentHorizontalEvenLayout from '@/components/base/v2/BaseContentHorizontalEvenLayout';
import BaseText from '@/components/base/v1/BaseText';

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
  },
  computed: {
    cols() {
      return 12 / this.names.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
  width: 100%;
}
.col {
  text-align: center;
  padding: 5px;
}
</style>
