<template>
  <BaseContentHorizontalLayout
    col-width-left="170px"
  >
    <template v-slot:left>
      <BaseContentHorizontalLayout
        col-width-left="130px"
      >
        <template v-slot:left>
          <div class="pr-2">
            <BaseDatePicker
              outlined
              :date="startDate"
              :min="minDate"
              :max="endDate"
              @change="onChangeStartDate"
            />
          </div>
        </template>
        <template v-slot:right>
          <div
            class="py-3"
          >
            <BaseText
              :text="suffixStartDate"
            />
          </div>
        </template>
      </BaseContentHorizontalLayout>
    </template>
    <template v-slot:right>
      <BaseContentHorizontalLayout
        col-width-left="130px"
      >
        <template v-slot:left>
          <div class="pr-2">
            <BaseDatePicker
              outlined
              :date="endDate"
              :min="startDate"
              :max="maxDate"
              @change="onChangeEndDate"
            />
          </div>
        </template>
        <template v-slot:right>
          <div
            class="py-3"
          >
            <BaseText
              :text="suffixEndDate"
            />
          </div>
        </template>
      </BaseContentHorizontalLayout>
    </template>
  </BaseContentHorizontalLayout>
</template>

<script>
import utils from '@/lib/utils';
import i18n from '@/plugins/vueI18n';
import BaseContentHorizontalLayout from './BaseContentHorizontalLayout';
import BaseText from './BaseText';
import BaseDatePicker from './BaseDatePicker';

export default {
  name: 'BaseDateRangeFromTo',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
    BaseDatePicker,
  },
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    suffixStartDate: {
      type: String,
      default: i18n.t('common.time.suffixFrom'),
    },
    suffixEndDate: {
      type: String,
      default: i18n.t('common.time.suffixTo'),
    },
    minDate: {
      type: String,
      default: utils.getLocalYYYYMMDDByAddDaysFromNow(-365),
    },
    maxDate: {
      type: String,
      default: utils.getLocalYYYYMMDDByAddDaysFromNow(1),
    },
  },
  methods: {
    onChangeStartDate(v) {
      this.emitTimeRange({
        startDate: v,
        endDate: this.endDate,
      });
    },
    onChangeEndDate(v) {
      this.emitTimeRange({
        startDate: this.startDate,
        endDate: v,
      });
    },
    emitTimeRange(dateRange) {
      this.$emit('change', dateRange);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
