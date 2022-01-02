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
      <BaseRadioGroup
        :items="radioGroupItems"
        :selected-value="selectedValue"
        :rules="rules"
        @change="onChange"
      />
    </BaseCol>
  </BaseRow>
</template>

<script>
import BaseText from './BaseText';
import BaseRow from './BaseRow';
import BaseCol from './BaseCol';
import BaseRadioGroup from './BaseRadioGroup';

export default {
  name: 'BaseListItemLabelRadioGroup',
  components: {
    BaseText,
    BaseRow,
    BaseCol,
    BaseRadioGroup,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    indent: {
      type: Number,
      default: 0,
    },
    radioGroupItems: {
      type: Array,
      required: true,
      validator(v) {
        const found = v.find(({ text, value }) => !text || !value);
        return !found;
      },
    },
    selectedValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    colIndentClass() {
      const indentSafe = (this.indent > 2) ? 2 : this.indent;
      return `pl-${1 + indentSafe * 6}`;
    },
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
