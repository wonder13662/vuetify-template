<template>
  <v-text-field
    :label="label"
    outlined
    dense
    hide-details="auto"
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
    @keydown.space="spaceHandler"
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
    onChange(v) {
      if (this.typeNumber && (!v || Number.isNaN(v))) {
        this.emitChange(0);
        return;
      }
      const safeStr = !v ? '' : v;
      this.emitChange(safeStr);
    },
    emitChange(v) {
      this.$emit('change', v);
    },
    onInput(v) {
      if (this.typeNumber && (!v || Number.isNaN(v))) {
        this.emitInput(0);
        return;
      }
      const safeStr = !v ? '' : v;
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
