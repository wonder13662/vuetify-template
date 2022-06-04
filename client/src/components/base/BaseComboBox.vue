<template>
  <v-select
    v-model="selectedItemsData"
    :items="items"
    :disabled="disabled"
    :rules="rules"
    item-text="text"
    item-value="value"
    return-object
    dense
    multiple
    clearable
    outlined
    hide-details="auto"
    small-chips
    @change="onChange"
  >
    <template v-slot:prepend-item>
      <v-list-item
        ripple
        @mousedown.prevent
        @click="toggle"
      >
        <v-list-item-action>
          <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">
            {{ icon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            Select All
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'BaseComboBox',
  props: {
    selectedItems: {
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
    disabled: {
      type: Boolean,
    },
    allowEmpty: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedItemsData: this.selectedItems,
      rules: this.getRules(this.allowEmpty),
    };
  },
  computed: {
    selectAllItems() {
      return this.selectedItemsData.length === this.items.length;
    },
    selectSomeItems() {
      return this.selectedItemsData.length > 0 && !this.selectAllItems;
    },
    icon() {
      if (this.selectAllItems) return 'mdi-close-box';
      if (this.selectSomeItems) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    },
  },
  watch: {
    disabled: {
      handler(v) {
        this.updateRules(v, this.allowEmpty);
      },
      immediate: true,
    },
    allowEmpty: {
      handler(v) {
        this.updateRules(this.disabled, v);
      },
      immediate: true,
    },
    selectedItems: {
      handler(v) {
        this.selectedItemsData = v;
      },
      immediate: true,
    },
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectAllItems) {
          this.selectedItemsData = [];
        } else {
          this.selectedItemsData = this.items.slice();
        }
        this.onChange([...this.selectedItemsData]);
      });
    },
    onChange(value) {
      this.$emit('change', value);
    },
    getRules(allowEmpty) {
      const rules = [];
      if (!allowEmpty) {
        rules.push((value) => (value && value.length > 0) || '1개 이상 선택해야 합니다.');
      }
      return rules;
    },
    updateRules(disabled, allowEmpty) {
      if (disabled) {
        this.rules = [];
        return;
      }
      this.rules = this.getRules(allowEmpty);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
