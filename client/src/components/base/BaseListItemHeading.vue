<template>
  <BaseRow
    :no-margin-padding="false"
  >
    <BaseCol
      :no-margin-padding="false"
    >
      <BaseHeading
        :size="0"
        :text="label"
      />
    </BaseCol>
  </BaseRow>
</template>

<script>
import BaseHeading from './BaseHeading';
import BaseRow from './BaseRow';
import BaseCol from './BaseCol';

export default {
  components: {
    BaseHeading,
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
