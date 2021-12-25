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

export default {
  name: 'DriverApprovePaginationTable',
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
          text: this.$t('views.admin.driver.header.name'),
          value: 'name',
        },
        {
          text: this.$t('views.admin.driver.header.phoneNumber'),
          value: 'phoneNumber',
        },
        {
          text: this.$t('views.admin.driver.header.email'),
          value: 'email',
        },
        {
          text: this.$t('views.admin.driver.header.transportation'),
          value: 'transportation',
        },
        {
          text: this.$t('views.admin.driver.header.privacyPolicyAgreement'),
          value: 'privacyPolicyAgreement',
        },
        {
          text: this.$t('views.admin.driver.header.driverLicense'),
          value: 'driverLicense',
        },
        {
          text: this.$t('views.admin.driver.header.insurance'),
          value: 'insurance',
        },
        {
          text: this.$t('views.admin.driver.header.approveStatus'),
          value: 'approveStatus',
        },
        {
          text: this.$t('views.admin.driver.header.memo'),
          value: 'memo',
        },
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    itemsComputed() {
      return this.items.map((v) => {
        const workingStatus = this.$t(`models.driver.workingStatus.${v.workingStatus}`);
        const walletId = v.walletId ? v.walletId.slice(0, 8) : '';
        const transportation = this.$t(`models.driverGroup.transportation.${v.transportation}`);
        const driverLicense = this.$t(`models.driver.driverLicense.${v.driverLicense}`);
        const approveStatus = this.$t(`models.serviceUser.approveStatus.${v.approveStatus}`);
        const privacyPolicyAgreement = this.$t(`models.user.privacyPolicyAgreement.${true}`);

        return {
          ...v,
          workingStatus,
          walletId,
          transportation,
          driverLicense,
          approveStatus,
          privacyPolicyAgreement,
        };
      });
    },
  },
  methods: {
    async onChangePage(page) {
      this.$emit('on-change-page', page);
    },
    onClickRow(row) {
      this.$emit('on-click-row', row);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
