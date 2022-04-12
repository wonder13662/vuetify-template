<!-- eslint-disable max-len -->
<template>
  <BaseContentHorizontalLayout
    col-width-left="150px"
  >
    <template v-slot:left>
      <div class="pr-2">
        <BaseDatePicker
          outlined
          :date="date"
          :min="minDate"
          :max="maxDate"
          @change="onChangedate"
        />
      </div>
    </template>
    <template v-slot:right>
      <div>
        <BaseContentHorizontalLayout
          col-width-left="150px"
        >
          <template v-slot:left>
            <div class="pr-2">
              <BaseHourRangeSelect
                :select="hour"
                :min="minHour"
                :max="maxHour"
                @change="onChangehour"
              />
            </div>
          </template>
          <template v-slot:right>
            <div
              v-if="suffix"
              class="py-3"
            >
              <BaseText
                :text="suffix"
              />
            </div>
          </template>
        </BaseContentHorizontalLayout>
      </div>
    </template>
  </BaseContentHorizontalLayout>
</template>

<script>
import moment from 'moment';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import BaseDatePicker from '@/components/base/BaseDatePicker';
import BaseHourRangeSelect from '@/components/base/BaseHourRangeSelect';

export default {
  name: 'BaseDateHourRange',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
    BaseDatePicker,
    BaseHourRangeSelect,
  },
  props: {
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    minDate: {
      type: String,
      default: moment().subtract(365, 'd').format('YYYY-MM-DD'),
    },
    minHour: {
      type: Number,
      default: 0,
    },
    maxDate: {
      type: String,
      default: moment().add(1, 'd').format('YYYY-MM-DD'),
    },
    maxHour: {
      type: Number,
      default: 21,
    },
  },
  methods: {
    onChangedate(v) {
      this.emitTimeRange({
        date: v,
        hour: this.hour,
      });
    },
    onChangehour(v) {
      const { value } = v;
      this.emitTimeRange({
        date: this.date,
        hour: parseInt(value, 10),
      });
    },
    emitTimeRange(timeRange) {
      this.$emit('change', timeRange);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
