<template>
  <div
    :class="{ 'd-flex':!vertical, 'flex-wrap':!vertical }"
  >
    <v-checkbox
      v-for="{ text, value } in items"
      :key="value"
      v-model="selected"
      :label="text"
      :value="value"
      :rules="rules"
      dense
      class="pl-2"
      hide-details
      @change="onChange"
    />
    <BaseRow>
      <BaseCol>
        <BaseText
          v-if="errorMsg"
          :text="errorMsg"
          :warning="true"
        />
      </BaseCol>
    </BaseRow>
  </div>
</template>

<script>
import BaseText from './BaseText';
import BaseRow from './BaseRow';
import BaseCol from './BaseCol';

export default {
  name: 'BaseCheckboxList',
  components: {
    BaseText,
    BaseRow,
    BaseCol,
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
  },
  data() {
    return {
      selected: this.selectedItems,
      errorMsg: '',
    };
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
