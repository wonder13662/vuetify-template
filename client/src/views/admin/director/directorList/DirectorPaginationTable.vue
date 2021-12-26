<template>
  <BasePaginationTable
    :headers="headers"
    :items="itemsComputed"
    :total-cnt="totalCnt"
    :item-cnt-per-page="itemsPerPage"
    :current-page="currentPage"
    @on-change-page="onChangePage"
    @on-click-row="onClickRow"
  />
</template>

<script>
import BasePaginationTable from '@/components/base/BasePaginationTable';
import utils from '@/lib/utils';

export default {
  name: 'DirectorPaginationTable',
  components: {
    BasePaginationTable,
  },
  props: {
    totalCnt: {
      type: Number,
      default: 0,
    },
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('views.admin.director.header.email'),
          value: 'email',
        },
        {
          text: this.$t('views.admin.director.header.name'),
          value: 'name',
        },
        {
          text: this.$t('views.admin.director.header.accountNumber'),
          value: 'accountNumber',
        },
        {
          text: this.$t('views.admin.director.header.approveStatusReadable'),
          value: 'approveStatusReadable',
        },
        {
          text: this.$t('views.admin.director.header.memo'),
          value: 'memo',
        },
        {
          text: this.$t('views.admin.director.header.phoneNumber'),
          value: 'phoneNumber',
        },
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    itemsComputed() {
      return this.items.map((v) => ({
        ...v,
        approveStatusReadable: utils.convertServiceUserApproveStatusReadable(v.approveStatus),
      }));
    },
  },
  methods: {
    async onChangePage(page) {
      this.currentPage = page;
      this.$emit('on-change-page', {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      });
    },
    onClickRow(row) {
      this.$emit('on-click-row', row);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
