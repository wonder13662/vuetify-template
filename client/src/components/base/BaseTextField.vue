<template>
  <v-text-field
    :label="label"
    outlined
    dense
    :hide-details="hideDetails"
    :clearable="!readonly"
    :prepend-inner-icon="prependInnerIcon"
    :value="value"
    :rules="rules"
    :type="type"
    :counter="counter"
    :placeholder="placeholder"
    :readonly="readonly"
    :prefix="prefix"
    :suffix="suffix"
    :disabled="disabled"
    :append-icon="appendIcon"
    autocomplete="new-password"
    @change="onChange"
    @input="onInput"
    @click:append="onAppendIconClick"
    @click:clear="onClear"
    @keydown.space="spaceHandler"
  />
</template>

<script>
import utils from '@/lib/utils';

export default {
  name: 'BaseTextField',
  props: {
    label: {
      type: String,
      default: '',
    },
    hideDetails: {
      type: [Boolean, String],
      default: 'auto',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
    // @ deprecated
    isSearchType: {
      type: Boolean,
    },
    typeSearch: {
      type: Boolean,
    },
    typePassword: {
      type: Boolean,
    },
    typeNumber: {
      type: Boolean,
    },
    typeEmail: {
      type: Boolean,
    },
    counter: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    prefix: {
      type: String,
      default: null,
    },
    suffix: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    prependInnerIcon() {
      return this.isSearchType || this.typeSearch ? 'mdi-magnify' : '';
    },
    type() {
      if (this.typePassword) {
        return this.showPassword ? 'text' : 'password';
      }
      if (this.typeNumber) {
        return 'number';
      }
      if (this.typeEmail) {
        return 'email';
      }
      return 'text';
    },
    appendIcon() {
      if (!this.typePassword) {
        return '';
      }
      if (this.showPassword) {
        return 'mdi-eye';
      }
      return 'mdi-eye-off';
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
    onClear() {
      if (this.typeNumber) {
        this.emitChange(0);
        this.emitInput(0);
        return;
      }
      this.emitChange('');
      this.emitInput('');
    },
    onChange(v) {
      const safeStr = !v ? '' : v;
      if (this.typeNumber) {
        if (utils.isNotNumber(safeStr)) {
          this.emitChange(null);
          return;
        }
        this.emitChange(Number(safeStr));
        return;
      }
      this.emitChange(safeStr);
    },
    emitChange(v) {
      this.$emit('change', v);
    },
    onInput(v) {
      const safeStr = !v ? '' : v;
      if (this.typeNumber) {
        if (utils.isNotNumber(safeStr)) {
          this.emitInput(null);
          return;
        }
        this.emitInput(Number(safeStr));
        return;
      }
      if (this.typeEmail) {
        const trimAndLowercaseStr = safeStr.split(' ').join('').toLowerCase();
        this.emitInput(trimAndLowercaseStr);
        return;
      }
      if (this.typePassword) {
        const trimStr = safeStr.split(' ').join('');
        this.emitInput(trimStr);
        return;
      }
      this.emitInput(safeStr);
    },
    emitInput(v) {
      this.$emit('input', v);
    },
    onAppendIconClick() {
      this.showPassword = !this.showPassword;
    },
    spaceHandler(event) {
      if (this.typeEmail || this.typePassword) {
        event.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
