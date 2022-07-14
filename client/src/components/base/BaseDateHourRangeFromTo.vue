<!-- eslint-disable max-len -->
<template>
  <div>
    <!-- 1. 가로모드 -->
    <div v-if="horizontal">
      <BaseContentHorizontalLayout
        col-width-left="350px"
      >
        <template v-slot:left>
          <!-- 1-1. 검색 시작 일/시각 입력 필드 -->
          <BaseDateHourRange
            :date="startDateData"
            :min-date="minDate"
            :max-date="endDateData"
            :min-hour="minStartHour"
            :max-hour="maxStartHour"
            :hour="startHourData"
            :suffix="startDateHourSuffix"
            @change="onChangeStart"
          />
        </template>
        <template v-slot:right>
          <!-- 1-2. 검색 종료 일/시각 입력 필드 -->
          <BaseDateHourRange
            :date="endDateData"
            :min-date="startDateData"
            :max-date="maxDate"
            :min-hour="minEndHour"
            :max-hour="maxEndHour"
            :hour="endHourData"
            :suffix="endDateHourSuffix"
            @change="onChangeEnd"
          />
        </template>
      </BaseContentHorizontalLayout>
    </div>
    <!-- 2. 세로모드 -->
    <div v-else>
      <!-- 2-1. 검색 시작 일/시각 입력 필드 -->
      <div class="pt-2">
        <BaseDateHourRange
          :date="startDateData"
          :min-date="minDate"
          :max-date="endDateData"
          :min-hour="minStartHour"
          :max-hour="maxStartHour"
          :hour="startHourData"
          :suffix="startDateHourSuffix"
          @change="onChangeStart"
        />
      </div>
      <!-- 2-2. 검색 종료 일/시각 입력 필드 -->
      <div class="pt-1">
        <BaseDateHourRange
          :date="endDateData"
          :min-date="startDateData"
          :max-date="maxDate"
          :min-hour="minEndHour"
          :max-hour="maxEndHour"
          :hour="endHourData"
          :suffix="endDateHourSuffix"
          @change="onChangeEnd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseDateHourRange from '@/components/base/BaseDateHourRange';
import utils from '@/lib/utils';
import {
  COMMON__THREE_HOUR_UNIT,
  COMMON__THREE_HOUR_UNIT_MIN,
  COMMON__THREE_HOUR_UNIT_MAX,
} from '@/lib/constants';

export default {
  name: 'BaseDateHourRangeFromTo',
  components: {
    BaseContentHorizontalLayout,
    BaseDateHourRange,
  },
  props: {
    startDate: {
      type: String,
      required: true,
    },
    startHour: {
      type: Number,
      required: true,
      validator: (v) => utils.is3HourUnit(v),
    },
    endDate: {
      type: String,
      required: true,
    },
    endHour: {
      type: Number,
      required: true,
      validator: (v) => utils.is3HourUnit(v),
    },
    horizontal: {
      type: Boolean,
    },
  },
  data() {
    return {
      startDateData: this.startDate,
      startHourData: this.startHour,
      endDateData: this.endDate,
      endHourData: this.endHour,
      startDateHourSuffix: this.$t('common.time.suffixFrom'),
      endDateHourSuffix: this.$t('common.time.suffixTo'),
      minDate: utils.getLocalYYYYMMDDByAddDaysFromNow(-365),
      maxDate: utils.getLocalYYYYMMDDByAddDaysFromNow(1),
    };
  },
  computed: {
    minStartHour() {
      return COMMON__THREE_HOUR_UNIT_MIN;
    },
    maxStartHour() {
      if (this.isSameDate) {
        return this.endHour - COMMON__THREE_HOUR_UNIT;
      }
      return COMMON__THREE_HOUR_UNIT_MAX;
    },
    minEndHour() {
      if (this.isSameDate) {
        return this.startHour + COMMON__THREE_HOUR_UNIT;
      }
      return COMMON__THREE_HOUR_UNIT_MIN;
    },
    maxEndHour() {
      return COMMON__THREE_HOUR_UNIT_MAX;
    },
    isSameDate() {
      return this.startDateData === this.endDateData;
    },
  },
  watch: {
    startDate: {
      handler(v) {
        this.startDateData = v;
      },
      immediate: true,
    },
    startHour: {
      handler(v) {
        this.startHourData = v;
      },
      immediate: true,
    },
    endDate: {
      handler(v) {
        this.endDateData = v;
      },
      immediate: true,
    },
    endHour: {
      handler(v) {
        this.endHourData = v;
      },
      immediate: true,
    },
  },
  methods: {
    onChangeStart(v) {
      const {
        date,
        hour,
      } = v;
      this.onChangeStartDate(date);
      if (this.isSameDate && hour >= this.endHourData) {
        this.onChangeStartHour(COMMON__THREE_HOUR_UNIT_MIN);
        this.onChangeEndHour(COMMON__THREE_HOUR_UNIT_MAX);
      } else {
        this.onChangeStartHour(hour);
      }
    },
    onChangeStartDate(v) {
      if (this.startDateData === v) {
        return;
      }
      this.startDateData = v;
      this.emitTimeRange();
    },
    onChangeStartHour(v) {
      if (this.startHourData === v) {
        return;
      }
      this.startHourData = v;
      this.emitTimeRange();
    },
    onChangeEnd(v) {
      const {
        date,
        hour,
      } = v;
      this.onChangeEndDate(date);
      if (this.isSameDate && hour <= this.startHourData) {
        this.onChangeStartHour(COMMON__THREE_HOUR_UNIT_MIN);
        this.onChangeEndHour(COMMON__THREE_HOUR_UNIT_MAX);
      } else {
        this.onChangeEndHour(hour);
      }
    },
    onChangeEndDate(v) {
      this.endDateData = v;
      this.emitTimeRange();
    },
    onChangeEndHour(v) {
      this.endHourData = v;
      this.emitTimeRange();
    },
    emitTimeRange() {
      this.$emit('change', this.getTimeRange());
    },
    getTimeRange() {
      return {
        startDate: this.startDateData,
        startHour: this.startHourData,
        endDate: this.endDateData,
        endHour: this.endHourData,
      };
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
