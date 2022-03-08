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
      dense
      :page="currentPage"
      :items-per-page="itemCntPerPage"
      :no-data-text="noDataText"
      :server-items-length="totalCnt"
      :loading="loading"
      loading-text="로딩중입니다. 잠시만 기다려주세요."
      hide-default-footer
      @click:row="onClickRow"
    />
    <div class="text-center pt-2 pb-2">
      <v-pagination
        :value="currentPage"
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
    loading: {
      type: Boolean,
    },
  },
  computed: {
    noDataText() {
      return this.$t('views.admin.common.noData');
    },
    pageCount() {
      const remainder = this.totalCnt % this.itemCntPerPage;
      return Math.floor(this.totalCnt / this.itemCntPerPage) + (remainder > 0 ? 1 : 0);
    },
  },
  methods: {
    async onChangePage(v) {
      this.$emit('change:page', v);
    },
    onClickRow(v) {
      this.$emit('click:row', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
