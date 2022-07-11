<template>
  <div>
    <!-- 1. 타이틀 -->
    <div>
      <BaseText
        :text="title"
      />
    </div>
    <!-- 2. 전체선택 체크박스 -->
    <div>
      <BaseCheckboxList
        :items="selectAllCheckBoxItems"
        :selected-items="selectAllCheckBoxItemsSelected"
        @change="onChangeSelectAllCheckBoxItems"
      />
    </div>
    <!-- 3. 선택가능 아이템 체크박스 -->
    <div class="ma-1 base-box">
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
  name: 'BaseCheckboxListSelectAll',
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
  data() {
    return {
      selectAllCheckBoxItems: [
        {
          text: '전체선택',
          value: 'selectAll',
        },
      ],
      selectAllCheckBoxItemsSelected: [],
    };
  },
  computed: {
    itemMap() {
      return this.items.reduce((map, item) => map.set(item.value, item), new Map());
    },
  },
  watch: {
    values: {
      handler(v) {
        this.updateSelectAllCheckBox(v);
      },
      immediate: true,
    },
  },
  methods: {
    updateSelectAllCheckBox(values) {
      const hasAllSelected = values.length === this.items.length;
      if (hasAllSelected) {
        this.selectAllCheckBoxItemsSelected = this.selectAllCheckBoxItems.map((v) => v.value);
      } else {
        // NOTE: 전체가 선택되지 않은 경우라면, 체크박스를 꺼줍니다.
        this.selectAllCheckBoxItemsSelected = [];
      }
    },
    onChangeItems(v) {
      this.updateSelectAllCheckBox(v);
      this.$emit('change', v);
    },
    onChangeSelectAllCheckBoxItems(v) {
      // NOTE: "전체선택" 체크박스를 선택,해제했을 때의 처리
      this.selectAllCheckBoxItemsSelected = v;
      const selectedItems = v.length > 0 ? this.items.map((item) => item.value) : [];
      this.$emit('change', selectedItems);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/leo.scss';
</style>
