<!-- eslint-disable max-len -->
<template>
  <BaseListItemLabelRadioGroup
    :label="`${$t('views.admin.driver.driverApproveList.modalBlockDriverGroupGrade')}`"
    :radio-group-items="radioGroupItems"
    :selected-value="selectedValue"
    @change="onChange"
  />
</template>

<script>
import BaseListItemLabelRadioGroup from '@/components/base/BaseListItemLabelRadioGroup';
import i18n from '@/plugins/vueI18n';
import {
  DRIVER_GROUP__GRADE,
} from '@/lib/constants';

export default {
  name: 'DriverApproveDialogRadioGroupGrade',
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
          text: i18n.t('models.driverGroup.grade.bronze'),
          value: DRIVER_GROUP__GRADE.BRONZE,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.grade.silver'),
          value: DRIVER_GROUP__GRADE.SILVER,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.grade.gold'),
          value: DRIVER_GROUP__GRADE.GOLD,
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
