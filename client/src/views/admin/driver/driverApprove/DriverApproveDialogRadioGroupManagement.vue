<!-- eslint-disable max-len -->
<template>
  <BaseListItemLabelRadioGroup
    :label="`${$t('views.admin.driver.driverApproveList.modalBlockDriverGroupManagement')}`"
    :radio-group-items="radioGroupItems"
    :selected-value="selectedValue"
    @change="onChange"
  />
</template>

<script>
import BaseListItemLabelRadioGroup from '@/components/base/BaseListItemLabelRadioGroup';
import i18n from '@/plugins/vueI18n';
import {
  DRIVER_GROUP__MANAGEMENT,
} from '@/lib/constants';

export default {
  name: 'DriverApproveDialogRadioGroupManagement',
  components: {
    BaseListItemLabelRadioGroup,
  },
  props: {
    selectedValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      radioGroupItems: [
        {
          text: i18n.t('models.driverGroup.management.warning'),
          value: DRIVER_GROUP__MANAGEMENT.WARNING,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.management.blackDriver'),
          value: DRIVER_GROUP__MANAGEMENT.BLACK_DRIVER,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.management.beginner'),
          value: DRIVER_GROUP__MANAGEMENT.BEGINNER,
          disabled: this.disabled,
        },
      ],
    };
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
