<template>
  <div
    v-if="vertical"
    class="base-list-item-label-combobox-vertical"
  >
    <BaseListItemDense>
      <BaseText
        :text="label"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseComboBox
        :items="items"
        :select="select"
        :disabled="disabled"
        @select-item="onChange"
      />
    </BaseListItemDense>
  </div>
  <BaseListItemLabelSlot
    v-else
    :label="label"
  >
    <BaseComboBox
      :items="items"
      :select="select"
      :disabled="disabled"
      @select-item="onChange"
    />
  </BaseListItemLabelSlot>
</template>

<script>
import BaseListItemLabelSlot from './BaseListItemLabelSlot';
import BaseListItemDense from './BaseListItemDense';
import BaseText from './BaseText';
import BaseComboBox from './BaseComboBox';

export default {
  name: 'BaseListItemLabelComboBox',
  components: {
    BaseListItemLabelSlot,
    BaseListItemDense,
    BaseText,
    BaseComboBox,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    select: {
      type: Array,
      default: () => ([]),
    },
    items: {
      type: Array,
      required: true,
      validator(values) {
        return values.findIndex((v) => !v || !v.text || !v.value);
      },
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
.base-list-item-label-combobox-vertical {
  width: 100%;
}
</style>
