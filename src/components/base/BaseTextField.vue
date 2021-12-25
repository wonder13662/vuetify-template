<template>
  <v-text-field
    :label="label"
    outlined
    dense
    hide-details="auto"
    clearable
    :prepend-inner-icon="prependInnerIcon"
    :value="value"
    :rules="rules"
    :type="type"
    :disabled="disabled"
    autocomplete="new-password"
    @change="onChange"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'BaseTextField',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
    isSearchType: {
      type: Boolean,
    },
    isPassword: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  computed: {
    prependInnerIcon() {
      return this.isSearchType ? 'mdi-magnify' : '';
    },
    type() {
      return this.isPassword ? 'password' : 'text';
    },
  },
  watch: {
    value(v) {
      if (this.value !== v) {
        this.value = v;
      }
    },
  },
  methods: {
    onChange(v) {
      const safeStr = !v ? '' : v;
      this.$emit('change', safeStr);
    },
    onInput(v) {
      const safeStr = !v ? '' : v;
      this.$emit('input', safeStr);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
