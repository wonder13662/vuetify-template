<template>
  <BaseListItemLabelSlot :label="label">
    <v-textarea
      background-color="grey lighten-5"
      counter="100"
      clearable
      dense
      no-resize
      outlined
      :value="text"
      :rules="rules"
      :disabled="disabled"
      @change="onChange"
    />
  </BaseListItemLabelSlot>
</template>

<script>
import BaseListItemLabelSlot from './BaseListItemLabelSlot';

export default {
  components: {
    BaseListItemLabelSlot,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    maxCount: {
      type: Number,
      required: true,
      validator(value) {
        return value > 0;
      },
    },
    isAllowEmpty: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: this.getRules(),
    };
  },
  methods: {
    onChange(value) {
      this.$emit('change-value', value);
    },
    getRules() {
      const rules = [];
      if (!this.isAllowEmpty) {
        rules.push((value) => (value && value.length > 0) || '내용을 입력해야 합니다.');
      }
      rules.push((value) => (!value || value === '' || value.length <= this.maxCount) || `입력된 내용이 ${this.maxCount}자 이하여야 합니다.`);
      return rules;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
