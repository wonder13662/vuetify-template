<template>
  <BaseSelect
    :select="hourSelect"
    :items="items"
    :error-message="errorMessage"
    :error="error"
    outlined
    @select-item="onChange"
  />
</template>

<script>
import BaseSelect from '@/components/base/BaseSelect';

export default {
  name: 'BaseHourRangeSelect',
  components: {
    BaseSelect,
  },
  props: {
    select: {
      type: Number,
      default: 0,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 21,
    },
  },
  computed: {
    hourSelect() {
      return this.items.find((v) => v.value === this.select);
    },
    items() {
      const items = [
        {
          text: this.$t('common.time.hourSelect0'),
          value: 0,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect3'),
          value: 3,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect6'),
          value: 6,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect9'),
          value: 9,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect12'),
          value: 12,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect15'),
          value: 15,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect18'),
          value: 18,
          disabled: false,
        },
        {
          text: this.$t('common.time.hourSelect21'),
          value: 21,
          disabled: false,
        },
      ];

      return items.map((item) => {
        if (this.min > item.value || this.max < item.value) {
          return {
            ...item,
            disabled: true,
          };
        }
        return item;
      });
    },
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
