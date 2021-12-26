<template>
  <div>
    <BaseListItemDense>
      <!-- eslint-disable max-len -->
      <BaseListItemLabel
        :label="`${$t('views.admin.director.directorList.searchFilterApproveStatusTitle')}`"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseCheckboxList
        :items="items"
        :selected-items="selectedItems"
        :rules="rules"
        @change="onChange"
      />
    </BaseListItemDense>
  </div>
</template>

<script>
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemLabel from '@/components/base/BaseListItemLabel';
import BaseCheckboxList from '@/components/base/BaseCheckboxList';
import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';

export default {
  name: 'DirectorSearchFilterApproveStatusCheckBox',
  components: {
    BaseListItemDense,
    BaseListItemLabel,
    BaseCheckboxList,
  },
  props: {
    selectedItems: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      items: [
        {
          text: i18n.t('models.serviceUser.approveStatus.wait'),
          value: SERVICEUSER_APPROVE_STATUS.WAIT,
        },
        {
          text: i18n.t('models.serviceUser.approveStatus.approve'),
          value: SERVICEUSER_APPROVE_STATUS.APPROVE,
        },
        {
          text: i18n.t('models.serviceUser.approveStatus.reject'),
          value: SERVICEUSER_APPROVE_STATUS.REJECT,
        },
      ],
      selectedItemsData: this.selectedItems,
      rules: [
        (value) => value.length > 0 || i18n.t('views.admin.director.directorList.searchFilterApproveStatusAlert'),
      ],
    };
  },
  methods: {
    onChange(v) {
      this.selectedItemsData = v;
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
