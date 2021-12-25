<!-- eslint-disable max-len -->
<template>
  <BaseDialog
    :is-show="isShow"
    :persistent="false"
    @submit="onSubmit"
    @on-close-dialog="onCloseDialog"
  >
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.driver.driverApproveList.modalTitle')"
        :size="1"
      />
    </BaseListItemDense>
    <v-divider />
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.driver.driverApproveList.modalBlockDriverInfo')"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.name')"
        :text="name"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.phoneNumber')"
        :text="phoneNumber"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.email')"
        :text="email"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <DriverApproveDialogRadioGroupApproveStatus
        :selected-value="selectedApproveStatus"
        @change="onChangeRadioGroupApproveStatus"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelTextArea
        :label="$t('views.admin.driver.header.memo')"
        :text="memo"
        :max-count="100"
        :is-allow-empty="true"
        :disabled="!isMemoEnabled"
        @change-value="onChangeMemo"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.privacyPolicyAgreement')"
        :text="privacyPolicyAgreement"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.transportation')"
        :text="transportation"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.driverLicense')"
        :text="driverLicense"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.insurance')"
        :text="insurance"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.driver.header.blackDriver')"
        :text="blackDriver"
      />
    </BaseListItemDense>

    <v-divider />
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.driver.driverApproveList.modalBlockDriverGroup')"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelComboBox
        :label="$t('views.admin.driver.driverApproveList.modalBlockDriverGroupElementCustomDriverGroupList')"
        :items="driverGroups"
        :vertical="false"
        :select="selectedCustomDriverGroups"
        :disabled="true"
        class="mb-2"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <DriverApproveDialogRadioGroupGrade
        :selected-value="selectedDriverGroupGradeInput"
        :disabled="true"
        @change="onChangeRadioGroupDriverGroupGrade"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <DriverApproveDialogRadioGroupTransportation
        :selected-value="selectedDriverGroupTransportationInput"
        :disabled="true"
        @change="onChangeRadioGroupDriverGroupTransportation"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <DriverApproveDialogRadioGroupManagement
        :selected-value="selectedDriverGroupManagementInput"
        :disabled="true"
        @change="onChangeRadioGroupDriverGroupManagement"
      />
    </BaseListItemDense>

    <BaseListItemDense>
      <BaseListItemLabel
        class="red--text"
        :label="$t('views.admin.driver.driverApproveList.modalBlockDriverGroupElementWarning')"
      />
    </BaseListItemDense>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/base/BaseDialog';
import BaseHeading from '@/components/base/BaseHeading';
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemLabel from '@/components/base/BaseListItemLabel';
import BaseListItemLabelText from '@/components/base/BaseListItemLabelText';
import BaseListItemLabelComboBox from '@/components/base/BaseListItemLabelComboBox';
import BaseListItemLabelTextArea from '@/components/base/BaseListItemLabelTextArea';
import DriverApproveDialogRadioGroupApproveStatus from './DriverApproveDialogRadioGroupApproveStatus';
import DriverApproveDialogRadioGroupGrade from './DriverApproveDialogRadioGroupGrade';
import DriverApproveDialogRadioGroupManagement from './DriverApproveDialogRadioGroupManagement';
import DriverApproveDialogRadioGroupTransportation from './DriverApproveDialogRadioGroupTransportation';

import {
  SERVICEUSER_APPROVE_STATUS,
  DRIVER_GROUP__TRANSPORTATION,
  DRIVER_GROUP__GRADE,
  DRIVER_GROUP__MANAGEMENT,
} from '@/lib/constants';

export default {
  name: 'DriverApproveDialog',
  components: {
    BaseDialog,
    BaseHeading,
    BaseListItemDense,
    BaseListItemLabel,
    BaseListItemLabelText,
    BaseListItemLabelComboBox,
    BaseListItemLabelTextArea,
    DriverApproveDialogRadioGroupApproveStatus,
    DriverApproveDialogRadioGroupGrade,
    DriverApproveDialogRadioGroupManagement,
    DriverApproveDialogRadioGroupTransportation,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    driver: {
      type: Object,
      default: null,
    },
    driverGroups: {
      type: Array,
      default: () => ([]),
    },
    selectedCustomDriverGroups: {
      type: Array,
      default: () => ([]),
    },
    selectedDriverGroupGrade: {
      type: String,
      default: '',
      validator: (value) => [
        '',
        DRIVER_GROUP__GRADE.BRONZE,
        DRIVER_GROUP__GRADE.SILVER,
        DRIVER_GROUP__GRADE.GOLD,
      ].includes(value),
    },
    selectedDriverGroupTransportation: {
      type: String,
      default: '',
      validator: (value) => [
        '',
        DRIVER_GROUP__TRANSPORTATION.WALK,
        DRIVER_GROUP__TRANSPORTATION.MOTORCYCLE,
        DRIVER_GROUP__TRANSPORTATION.CAR,
        DRIVER_GROUP__TRANSPORTATION.BICYCLE,
      ].includes(value),
    },
    selectedDriverGroupManagement: {
      type: String,
      default: '',
      validator: (value) => [
        '',
        DRIVER_GROUP__MANAGEMENT.WARNING,
        DRIVER_GROUP__MANAGEMENT.BLACK_DRIVER,
        DRIVER_GROUP__MANAGEMENT.BEGINNER,
      ].includes(value),
    },
  },
  data() {
    return {
      selectedCustomDriverGroupsInput: this.selectedCustomDriverGroups,
      selectedApproveStatus: this.driver && this.driver.approveStatus ? this.driver.approveStatus : '',
      memo: this.driver && this.driver.memo ? this.driver.memo : '',
      selectedDriverGroupGradeInput: this.selectedDriverGroupGrade,
      selectedDriverGroupTransportationInput: this.selectedDriverGroupTransportation,
      selectedDriverGroupManagementInput: this.selectedDriverGroupManagement,
    };
  },
  computed: {
    name() {
      if (!this.driver) { return ''; }
      return this.driver.name ? this.driver.name : '';
    },
    phoneNumber() {
      if (!this.driver) { return ''; }
      return this.driver.phoneNumber ? this.driver.phoneNumber : '';
    },
    email() {
      if (!this.driver) { return ''; }
      return this.driver.email ? this.driver.email : '';
    },
    approveStatusReadable() {
      if (!this.driver) { return ''; }
      return this.driver.approveStatusReadable ? this.driver.approveStatusReadable : '';
    },
    isMemoEnabled() {
      return this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.REJECT;
    },
    privacyPolicyAgreement() {
      if (!this.driver) { return ''; }
      return this.$t(`models.user.privacyPolicyAgreement.${true}`);
    },
    transportation() {
      if (!this.driver) { return ''; }
      const { transportation } = this.driver;
      return this.$t(`models.driverGroup.transportation.${transportation}`);
    },
    driverLicense() {
      if (!this.driver) { return ''; }
      const { driverLicense } = this.driver;
      return this.$t(`models.driver.driverLicense.${driverLicense}`);
    },
    insurance() {
      if (!this.driver) { return ''; }
      const { insurance } = this.driver;
      return insurance;
    },
    blackDriver() {
      return '미가입';
    },
  },
  watch: {
    driver(value) {
      this.selectedApproveStatus = value && value.approveStatus ? value.approveStatus : '';
    },
  },
  methods: {
    onSubmit() {
      if (this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.APPROVE) {
        const driverApproved = {
          serviceUserId: this.driver.serviceUserId,
          approveStatus: SERVICEUSER_APPROVE_STATUS.APPROVE,
        };
        this.$emit('on-approve', driverApproved);
      } else if (this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.REJECT) {
        const driverRejected = {
          serviceUserId: this.driver.serviceUserId,
          approveStatus: SERVICEUSER_APPROVE_STATUS.REJECT,
          memo: this.memo,
        };
        this.$emit('on-reject', driverRejected);
      }
    },
    onCloseDialog() {
      this.$emit('on-close-dialog');
    },
    onChangeMemo(v) {
      this.memo = v;
    },
    onChangeRadioGroupApproveStatus(v) {
      const { APPROVE, REJECT } = SERVICEUSER_APPROVE_STATUS;
      if ([APPROVE, REJECT].includes(v)) {
        this.selectedApproveStatus = v;
      }
    },
    onChangeRadioGroupDriverGroupGrade(v) {
      // eslint-disable-next-line no-console
      console.log('onChangeRadioGroupDriverGroupGrade / v:', v);
    },
    onChangeRadioGroupDriverGroupManagement(v) {
      // eslint-disable-next-line no-console
      console.log('onChangeRadioGroupDriverGroupManagement / v:', v);
    },
    onChangeRadioGroupDriverGroupTransportation(v) {
      // eslint-disable-next-line no-console
      console.log('onChangeRadioGroupDriverGroupTransportation / v:', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
