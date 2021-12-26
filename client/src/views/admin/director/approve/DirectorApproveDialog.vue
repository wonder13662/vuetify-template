<!-- eslint-disable max-len -->
<template>
  <BaseDialog
    :is-show="isShow"
    :cancel-btn-name="$t('views.admin.director.directorApproveList.modalBlockCancelBtn')"
    :submit-btn-name="$t('views.admin.director.directorApproveList.modalBlockSubmitBtn')"
    :persistent="false"
    @submit="onSubmit"
    @cancel="onCancel"
    @on-close-dialog="onCloseDialog"
  >
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.director.directorApproveList.modalTitle')"
        :size="1"
      />
    </BaseListItemDense>
    <v-divider />
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.director.directorApproveList.modalBlockDirectorInfo')"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.director.header.name')"
        :text="name"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.director.header.phoneNumber')"
        :text="phoneNumber"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelText
        :label="$t('views.admin.director.header.email')"
        :text="email"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <DirectorApproveDialogApproveStatusRadioGroup
        :selected-value="selectedApproveStatus"
        @change="onChangeApproveStatusRadioGroup"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelTextArea
        :label="$t('views.admin.director.header.memo')"
        :text="memo"
        :max-count="100"
        :is-allow-empty="true"
        :disabled="!isMemoEnabled"
        @change-value="onChangeMemo"
      />
    </BaseListItemDense>
    <v-divider />
    <BaseListItemDense>
      <BaseHeading
        class="pa-1"
        :text="$t('views.admin.director.directorApproveList.modalBlockDirectorGroup')"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabelComboBox
        :label="$t('views.admin.director.directorApproveList.modalBlockDirectorGroupElementDirectorGroupList')"
        :items="directorGroups"
        :vertical="false"
        :select="selectedDirectorGroups"
        :disabled="true"
        class="mb-2"
        @select-item="onChangeDirectorGroups"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseListItemLabel
        class="red--text"
        :label="$t('views.admin.director.directorApproveList.modalBlockDirectorGroupElementWarning')"
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
import DirectorApproveDialogApproveStatusRadioGroup from './DirectorApproveDialogApproveStatusRadioGroup';

import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default {
  name: 'DirectorApproveDialog',
  components: {
    BaseDialog,
    BaseHeading,
    BaseListItemDense,
    BaseListItemLabel,
    BaseListItemLabelText,
    BaseListItemLabelComboBox,
    BaseListItemLabelTextArea,
    DirectorApproveDialogApproveStatusRadioGroup,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    director: {
      type: Object,
      default: null,
    },
    directorGroups: {
      type: Array,
      default: () => ([]),
    },
    selectedDirectorGroups: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      selectedDirectorGroupsInput: this.selectedDirectorGroups,
      selectedApproveStatus: this.director && this.director.approveStatus ? this.director.approveStatus : '',
      memo: this.director && this.director.memo ? this.director.memo : '',
    };
  },
  computed: {
    name() {
      return this.director && this.director.name ? this.director.name : '';
    },
    phoneNumber() {
      return this.director && this.director.phoneNumber ? this.director.phoneNumber : '';
    },
    email() {
      return this.director && this.director.email ? this.director.email : '';
    },
    approveStatusReadable() {
      return this.director && this.director.approveStatusReadable ? this.director.approveStatusReadable : '';
    },
    isMemoEnabled() {
      return this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.REJECT;
    },
  },
  watch: {
    director(value) {
      this.selectedApproveStatus = value && value.approveStatus ? value.approveStatus : '';
    },
  },
  methods: {
    onSubmit() {
      if (this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.APPROVE) {
        const directorApproved = {
          serviceUserId: this.director.serviceUserId,
          approveStatus: SERVICEUSER_APPROVE_STATUS.APPROVE,
        };
        this.$emit('on-approve', directorApproved);
      } else if (this.selectedApproveStatus === SERVICEUSER_APPROVE_STATUS.REJECT) {
        const directorRejected = {
          serviceUserId: this.director.serviceUserId,
          approveStatus: SERVICEUSER_APPROVE_STATUS.REJECT,
          memo: this.memo,
        };
        this.$emit('on-reject', directorRejected);
      }
    },
    onCloseDialog() {
      this.$emit('on-close-dialog');
    },
    onChangeMemo(v) {
      this.memo = v;
    },
    onChangeApproveStatusRadioGroup(v) {
      const { APPROVE, REJECT } = SERVICEUSER_APPROVE_STATUS;
      if ([APPROVE, REJECT].includes(v)) {
        this.selectedApproveStatus = v;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
