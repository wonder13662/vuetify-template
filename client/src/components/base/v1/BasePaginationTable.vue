<template>
  <v-card
    :elevation="0"
  >
    <!-- eslint-disable max-len -->
    <v-card-title>
      {{ `${$t('views.admin.common.total')} ${totalCnt} ${$t('views.admin.common.rowUnit')}` }}
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :dense="true"
      :page="page"
      :no-data-text="noDataText"
      :server-items-length="totalCnt"
      :options="options"
      hide-default-footer
      @click:row="onClickRow"
    />
    <div class="text-center pt-2 pb-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="onChangePage"
      />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'BasePaginationTable',
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
    totalCnt: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    itemCntPerPage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      itemsPerPage: this.itemCntPerPage,
      pageStart: 0,
      pageStop: 10,
    };
  },
  computed: {
    options() {
      return {
        page: this.page,
        itemsPerPage: this.itemsPerPage,
        pageStart: this.pageStart,
        pageStop: this.pageStop,
        pageCount: this.pageCount,
      };
    },
    noDataText() {
      return this.$t('views.admin.common.noData');
    },
    pageCount() {
      const remainder = this.totalCnt % this.itemsPerPage;
      return Math.floor(this.totalCnt / this.itemsPerPage) + (remainder > 0 ? 1 : 0);
    },
  },
  methods: {
    async onChangePage(v) {
      this.$emit('on-change-page', v);
    },
    onClickRow(v) {
      this.$emit('on-click-row', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
