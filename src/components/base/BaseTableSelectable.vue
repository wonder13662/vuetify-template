<template>
  <v-card class="elevation-0">
    <v-card-title>
      {{ title }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      :value="selected"
      :headers="headers"
      :items="items"
      :search="search"
      :item-key="itemKey"
      :disable-pagination="true"
      :hide-default-footer="true"
      :items-per-page="-1"
      show-select
      dark
      class="elevation-0"
      @input="onChange"
    />
  </v-card>
</template>

<script>
export default {
  name: 'BaseTableSelectable',
  props: {
    title: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
    selected: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
