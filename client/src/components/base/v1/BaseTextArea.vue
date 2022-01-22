<template>
  <v-textarea
    background-color="grey lighten-5"
    counter="100"
    clearable
    dense
    no-resize
    outlined
    :hide-details="hideDetails"
    :value="text"
    :rules="rules"
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'BaseTextArea',
  props: {
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
    // NOTE: 공백을 허용하는 입력창인 경우 이 속성을 true로 전달합니다.
    allowEmpty: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      rules: this.getRules(),
    };
  },
  computed: {
    hideDetails() {
      if (this.disabled) {
        return true;
      }
      return 'auto';
    },
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
    getRules() {
      if (this.allowEmpty) {
        return [];
      }
      return [
        (value) => (value && value.length > 0) || '내용을 입력해야 합니다.',
        (value) => (value && value.length <= this.maxCount) || `입력된 내용이 ${this.maxCount}자 이하여야 합니다.`,
      ];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
