<template>
  <BaseListItemLabelSlot :label="label">
    <!-- TODO 국가에 따라서 다양한 통화를 지원해야 함 -->
    <v-text-field
      prepend-icon="mdi-currency-krw"
      :rules="rules"
      dense
      :readonly="readonly"
      :value="amount"
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
    readonly: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
      validator(value) {
        // TODO props에서 받는 것과, input 입력시에 rules로 검사하는 것을 공용으로 만들 수 있다.
        if (value < 0) {
          return false;
        }

        const pattern = /^\d+$/;
        if (!pattern.test(value)) {
          return false;
        }

        return true;
      },
    },
  },
  data() {
    return {
      rules: [
        (value) => !!value || '금액을 입력해야 합니다.',
        (value) => Number(value) >= 0 || '0 이상의 액수를 입력해야 합니다.',
        (value) => {
          const pattern = /^\d+$/;
          return pattern.test(value) || '정수로 입력해야 합니다.';
        },
      ],
    };
  },
  methods: {
    onChange(value) {
      this.$emit('change-value', value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
