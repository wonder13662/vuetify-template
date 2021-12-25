<template>
  <v-combobox
    v-model="userSelect"
    :items="items"
    item-text="text"
    item-value="value"
    return-object
    dense
    multiple
    clearable
    outlined
    hide-details
    small-chips
    :disabled="disabled"
    @change="onChange"
  >
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="`${item.color} lighten-3`"
        :input-value="selected"
        label
        small
        class="ma-1"
      >
        <span class="pr-2">
          {{ item.text }}
        </span>
        <v-icon
          small
          @click="parent.selectItem(item)"
        >
          $delete
        </v-icon>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
// FIX ME: select를 나중에 다시 입력받으면 반영되지 않는 문제가 있음
export default {
  name: 'BaseComboBox',
  props: {
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
    disabled: {
      type: Boolean,
      default: false,
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
