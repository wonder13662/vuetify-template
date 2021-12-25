<template>
  <BaseRow>
    <BaseCol :cols="4">
      <BaseText :text="label" />
    </BaseCol>
    <BaseCol :cols="8">
      <slot />
    </BaseCol>
  </BaseRow>
</template>

<script>
import BaseText from './BaseText';
import BaseRow from './BaseRow';
import BaseCol from './BaseCol';

export default {
  components: {
    BaseText,
    BaseRow,
    BaseCol,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
