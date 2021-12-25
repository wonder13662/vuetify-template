<template>
  <BaseRow>
    <BaseCol>
      <BaseText :text="label" />
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
