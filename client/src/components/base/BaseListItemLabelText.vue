<template>
  <BaseRow>
    <BaseCol
      :cols="4"
      :class="[colIndentClass]"
    >
      <BaseText :text="label" />
    </BaseCol>
    <BaseCol
      :cols="8"
    >
      <BaseText :text="text" />
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
    text: {
      type: String,
      required: true,
    },
    hasStriped: {
      type: Boolean,
      default: false,
    },
    indent: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    colIndentClass() {
      const indentSafe = (this.indent > 2) ? 2 : this.indent;
      return `pl-${1 + indentSafe * 6}`;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
