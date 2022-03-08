<template>
  <BaseListItemLabelSlot :label="label">
    <v-select
      v-model="userSelect"
      :items="items"
      item-text="text"
      item-value="value"
      return-object
      single-line
      dense
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
    select: {
      type: Object,
      default: null,
      validator(value) {
        return value && value.text && value.value;
      },
    },
    items: {
      type: Array,
      required: true,
      validator(values) {
        return values.findIndex((v) => !v || !v.text || !v.value);
      },
    },
  },
  data() {
    return {
      userSelect: this.select,
    };
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
