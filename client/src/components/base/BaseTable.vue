<template>
  <v-data-table
    :headers="headers"
    :items="items"
    dense
    :no-data-text="noDataText"
    :loading="loading"
    loading-text="로딩중입니다. 잠시만 기다려주세요."
    hide-default-footer
    @click:row="onClickRow"
  >
    <template v-slot:item.actions="{ item }">
      <slot :item="item" />
    </template>
  </v-data-table>
</template>

<script>
// https://v2.vuejs.org/v2/guide/components-slots.html#Scoped-Slots
export default {
  name: 'BaseTable',
  props: {
    headers: {
      type: Array,
      required: true,
      validator(v) {
        const found = v.findIndex((item) => !item.text || !item.value);
        return !(found > -1);
      },
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
    },
  },
  computed: {
    noDataText() {
      return this.$t('views.admin.common.noData');
    },
  },
  methods: {
    onClickRow(v) {
      this.$emit('click:row', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
