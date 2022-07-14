<template>
  <v-select
    :value="value || select"
    :items="items"
    item-text="text"
    item-value="value"
    return-object
    single-line
    outlined
    dense
    :disabled="disabled"
    :hide-details="!errorMessage"
    :rules="rules"
    :error-messages="errorMessage"
    v-bind="$attrs"
    @change="onChange"
  />
</template>

<script>
export default {
  props: {
    select: { // @ deprecated - value를 사용해주세요
      type: Object,
      default: null,
      validator(value) {
        return value && value.text && (value.value === 0 || value.value);
      },
    },
    value: {
      type: [String, Number],
      default: null,
    },
    items: {
      type: Array,
      required: true,
      validator(values) {
        return values.findIndex((v) => !v || !v.text || (v.value !== 0 && !v.value));
      },
    },
    errorMessage: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
  },
  methods: {
    onChange(selectedItem) {
      // @ depreacted
      this.$emit('select-item', selectedItem);
      this.$emit('change', selectedItem.value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
