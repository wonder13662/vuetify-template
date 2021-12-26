<template>
  <div>
    <BaseHeading
      :text="title"
    />
    <DirectorApprovePagination
      :items="items"
      :total-cnt="totalCnt"
      @on-change-page="onChangePage"
      @on-click-row="onClickRow"
    />
    <DirectorApproveDialog
      :is-show="dialog.isShow"
      :director="dialog.item"
      @on-approve="onApprove"
      @on-reject="onReject"
      @on-close-dialog="onCloseDialog"
    />
  </div>
</template>

<script>
import store from '@/store';
import BaseHeading from '@/components/base/BaseHeading';
import DirectorApprovePagination from './DirectorApprovePagination';
import DirectorApproveDialog from './DirectorApproveDialog';
import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default {
  name: 'DirectorApprovePage',
  components: {
    BaseHeading,
    DirectorApprovePagination,
    DirectorApproveDialog,
  },
  data() {
    return {
      itemsPerPage: 10,
      title: this.$t('views.admin.director.directorApproveList.title'),
      dialog: {
        isShow: false,
        item: null,
      },
    };
  },
  computed: {
    totalCnt() {
      return store.getters['directorApproveList/totalCnt'];
    },
    items() {
      return store.getters['directorApproveList/list'];
    },
  },
  async created() {
    const query = { approveStatus: SERVICEUSER_APPROVE_STATUS.WAIT };
    await store.dispatch('directorApproveList/fetchList', { query });
  },
  methods: {
    async onChangePage(page) {
      store.dispatch('directorApproveList/setPagination', {
        pagination: {
          currentPage: page,
          limit: this.itemsPerPage,
        },
      });

      await store.dispatch('directorApproveList/fetchList');
    },
    onClickRow(row) {
      this.dialog.item = row;
      this.dialog.isShow = true;
    },
    async onApprove(v) {
      const {
        serviceUserId,
      } = v;
      await store.dispatch('directorApproveList/approveDirector', { serviceUserId });
    },
    async onReject(v) {
      const {
        serviceUserId,
        memo,
      } = v;
      await store.dispatch('directorApproveList/rejectDirector', { serviceUserId, memo });
    },
    onCloseDialog() {
      this.dialog.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
