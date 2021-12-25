<template>
  <div>
    <BaseHeading
      :text="title"
    />
    <DriverApprovePagination
      :items="items"
      :total-cnt="totalCnt"
      @on-change-page="onChangePage"
      @on-click-row="onClickRow"
    />
    <DriverApproveDialog
      :is-show="dialog.isShow"
      :driver="dialog.item"
      @on-approve="onApprove"
      @on-reject="onReject"
      @on-close-dialog="onCloseDialog"
    />
  </div>
</template>

<script>
import store from '@/store';
import BaseHeading from '@/components/base/BaseHeading';
import DriverApprovePagination from './DriverApprovePagination';
import DriverApproveDialog from './DriverApproveDialog';
import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default {
  name: 'DriverApprovePage',
  components: {
    BaseHeading,
    DriverApprovePagination,
    DriverApproveDialog,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      title: this.$t('views.admin.driver.driverApproveList.title'),
      dialog: {
        isShow: false,
        item: null,
      },
    };
  },
  computed: {
    totalCnt() {
      return store.getters['driverApproveList/totalCnt'];
    },
    items() {
      return store.getters['driverApproveList/list'];
    },
  },
  async created() {
    const query = { approveStatusList: [SERVICEUSER_APPROVE_STATUS.WAIT] };
    await store.dispatch('driverApproveList/fetchList', { query });
  },
  methods: {
    async onChangePage(page) {
      this.currentPage = page;
      store.dispatch('driverApproveList/setPagination', {
        pagination: {
          currentPage: page,
          limit: this.itemsPerPage,
        },
      });

      const query = { approveStatusList: [SERVICEUSER_APPROVE_STATUS.WAIT] };
      await store.dispatch('driverApproveList/fetchList', { query });
    },
    onClickRow(row) {
      const { serviceUserId } = row;
      const driver = store.getters['driverApproveList/driver'](serviceUserId);
      this.dialog.item = driver;
      this.dialog.isShow = true;
    },
    async onApprove(v) {
      const {
        serviceUserId,
      } = v;
      await store.dispatch('driverApproveList/approveDriver', { serviceUserId });
    },
    async onReject(v) {
      const {
        serviceUserId,
        memo,
      } = v;
      await store.dispatch('driverApproveList/rejectDriver', { serviceUserId, memo });
    },
    onCloseDialog() {
      this.dialog.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
