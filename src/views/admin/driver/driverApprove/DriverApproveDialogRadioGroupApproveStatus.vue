<!-- eslint-disable max-len -->
<template>
  <BaseListItemLabelRadioGroup
    :label="`${$t('views.admin.driver.driverApproveList.modalBlockDriverGroupApproveStatus')}`"
    :radio-group-items="radioGroupItems"
    :selected-value="selectedValue"
    :rules="rules"
    @change="onChange"
  />
</template>

<script>
import BaseListItemLabelRadioGroup from '@/components/base/BaseListItemLabelRadioGroup';
import i18n from '@/plugins/vueI18n';
import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default {
  name: 'DriverApproveDialogRadioGroupApproveStatus',
  components: {
    BaseListItemLabelRadioGroup,
  },
  props: {
    selectedValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      radioGroupItems: [
        {
          text: i18n.t('models.serviceUser.approveStatus.wait'),
          value: SERVICEUSER_APPROVE_STATUS.WAIT,
          disabled: true,
        },
        {
          text: i18n.t('models.serviceUser.approveStatus.approve'),
          value: SERVICEUSER_APPROVE_STATUS.APPROVE,
          disabled: false,
        },
        {
          text: i18n.t('models.serviceUser.approveStatus.reject'),
          value: SERVICEUSER_APPROVE_STATUS.REJECT,
          disabled: false,
        },
      ],
      rules: [
        this.rule,
      ],
    };
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
    rule(value) {
      const { APPROVE, REJECT } = SERVICEUSER_APPROVE_STATUS;
      const errorMsg = i18n.t('views.admin.driver.driverApproveList.modalErrorServiceUserApproveStatusWait');
      return [APPROVE, REJECT].includes(value) || errorMsg;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
