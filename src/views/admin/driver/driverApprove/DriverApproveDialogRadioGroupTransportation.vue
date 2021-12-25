<!-- eslint-disable max-len -->
<template>
  <BaseListItemLabelRadioGroup
    :label="`${$t('views.admin.driver.driverApproveList.modalBlockDriverGroupTransportation')}`"
    :radio-group-items="radioGroupItems"
    :selected-value="selectedValue"
    @change="onChange"
  />
</template>

<script>
import BaseListItemLabelRadioGroup from '@/components/base/BaseListItemLabelRadioGroup';
import i18n from '@/plugins/vueI18n';
import {
  DRIVER_GROUP__TRANSPORTATION,
} from '@/lib/constants';

export default {
  name: 'DriverApproveDialogRadioGroupTransportation',
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
          text: i18n.t('models.driverGroup.transportation.walk'),
          value: DRIVER_GROUP__TRANSPORTATION.WALK,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.transportation.motorcycle'),
          value: DRIVER_GROUP__TRANSPORTATION.MOTORCYCLE,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.transportation.car'),
          value: DRIVER_GROUP__TRANSPORTATION.CAR,
          disabled: this.disabled,
        },
        {
          text: i18n.t('models.driverGroup.transportation.bicycle'),
          value: DRIVER_GROUP__TRANSPORTATION.BICYCLE,
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
