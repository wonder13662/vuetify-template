<template>
  <div>
    <!-- 1. 타이틀 -->
    <div>
      <BaseText
        :text="title"
      />
    </div>
    <!-- 2. 선택가능 아이템 체크박스 -->
    <div class="pa-2">
      <BaseCheckboxList
        :items="items"
        :selected-items="values"
        :rules="rules"
        @change="onChangeItems"
      />
    </div>
  </div>
</template>

<script>
import BaseText from '@/components/base/BaseText';
import BaseCheckboxList from '@/components/base/BaseCheckboxList';

export default {
  name: 'BaseCheckboxListRow',
  components: {
    BaseText,
    BaseCheckboxList,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    values: {
      type: Array,
      default: () => ([]),
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
  },
  methods: {
    onChangeItems(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/leo.scss';
</style>
