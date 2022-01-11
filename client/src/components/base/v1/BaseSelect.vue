<template>
  <v-select
    :value="select"
    :items="items"
    item-text="text"
    item-value="value"
    return-object
    single-line
    dense
    :disabled="disabled"
    :hide-details="!errorMessage"
    :error-messages="errorMessage"
    v-bind="$attrs"
    @change="onChange"
  />
</template>

<script>
export default {
  props: {
    select: {
      type: Object,
      default: null,
      validator(value) {
        return value && value.text && (value.value === 0 || value.value);
      },
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
  },
  methods: {
    onChange(value) {
      this.$emit('select-item', value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
