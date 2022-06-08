<template>
  <v-textarea
    background-color="grey lighten-5"
    :counter="maxCount"
    :clearable="!disabled && !readonly"
    dense
    no-resize
    outlined
    :hide-details="hideDetails"
    :value="text"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    @input="onInput"
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
    readonly: {
      type: Boolean,
    },
  },
  data() {
    return {
      rules: this.getRules(this.allowEmpty),
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
  watch: {
    allowEmpty: {
      handler(v) {
        if (this.disabled) {
          this.rules = [];
          return;
        }
        this.rules = this.getRules(v);
      },
      immediate: true,
    },
    disabled: {
      handler(v) {
        if (v) {
          this.rules = [];
          return;
        }
        this.rules = this.getRules(this.allowEmpty);
      },
      immediate: true,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('change', value);
    },
    getRules(allowEmpty) {
      const rules = [];
      if (!allowEmpty) {
        rules.push((value) => (value && value.length > 0) || '내용을 입력해야 합니다.');
      }
      rules.push((value) => ((!!value || value === '') && value.length <= this.maxCount) || `입력된 내용이 ${this.maxCount}자 이하여야 합니다.`);
      return rules;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
