<template>
  <v-radio-group
    class="pa-0 ma-0"
    :row="directionRow"
    :column="!directionRow"
    dense
    hide-details="auto"
    :value="selectedValueData"
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
    row: {
      type: Boolean,
    },
    column: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedValueData: this.selectedValue,
    };
  },
  computed: {
    directionRow() {
      if (this.row) {
        return true;
      }
      if (this.column) {
        return false;
      }
      return true;
    },
  },
  watch: {
    selectedValue(v) {
      if (this.selectedValueData !== v) {
        this.selectedValueData = v;
      }
    },
  },
  methods: {
    onChange(v) {
      this.guardUnexpectedNullFromVuetifyRadioGroup(v);
    },
    guardUnexpectedNullFromVuetifyRadioGroup(v) {
      // 주의: 다이얼로그를 닫을 때 Radio Group에서 null을 변경된 데이터로 줍니다.
      // 이를 방어하는 코드입니다.
      if (!v) {
        return;
      }
      // radio button에 표시된 값이 아니라면 부모에게 변경 이벤트를 호출하지 않습니다.
      const found = this.items.find(({ value }) => value === v);
      if (!found) {
        return;
      }
      this.selectedValueData = v;
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
