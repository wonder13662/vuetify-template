<template>
  <div
    :class="{ 'd-flex':!vertical, 'flex-wrap':!vertical }"
  >
    <v-checkbox
      v-for="({ text, value }, idx) in items"
      :key="value"
      v-model="selected"
      class="pa-0 ma-0"
      :class="{ 'pl-2': idx > 0 }"
      :label="text"
      :value="value"
      :rules="rules"
      :disabled="disabled"
      dense
      hide-details
      @change="onChange"
    />
    <div
      v-if="errorMsg"
    >
      <BaseText
        :text="errorMsg"
        :warning="true"
      />
    </div>
  </div>
</template>

<script>
import BaseText from './BaseText';

export default {
  name: 'BaseCheckboxList',
  components: {
    BaseText,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    selectedItems: {
      type: Array,
      default: () => ([]),
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      selected: this.selectedItems,
      errorMsg: '',
    };
  },
  watch: {
    selectedItems(v) {
      if (this.selected.length === 0 && (!v || v.length === 0)) {
        return;
      }
      this.selected = v;
    },
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
      const result = this.validate(v);
      if (typeof result === 'string') {
        this.errorMsg = result;
      } else {
        this.errorMsg = '';
      }
    },
    validate(value) {
      if (!this.rules || this.rules.length === 0) {
        return true;
      }
      // eslint-disable-next-line no-plusplus
      for (let idx = 0; idx < this.rules.length; idx++) {
        const rule = this.rules[idx];
        const result = rule(value);
        if (typeof result === 'string') {
          return result;
        }
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
