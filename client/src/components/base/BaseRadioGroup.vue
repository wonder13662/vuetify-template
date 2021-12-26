<template>
  <v-radio-group
    class="pa-1 ma-0"
    row
    dense
    :value="selectedValue"
    :rules="rules"
    :validate-on-blur="true"
    @change="onChange"
  >
    <v-radio
      v-for="(item, index) in items"
      :key="index"
      :label="item.text"
      :value="item.value"
      :disabled="item.disabled"
    />
  </v-radio-group>
</template>

<script>
export default {
  name: 'BaseRadioGroup',
  props: {
    items: {
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
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
