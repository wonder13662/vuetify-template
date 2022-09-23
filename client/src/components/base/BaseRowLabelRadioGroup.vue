<template>
  <div>
    <!-- 1. 세로형 -->
    <div v-if="vertical">
      <div class="pa-1">
        <BaseText
          bold
          :text="label"
        />
      </div>
      <div>
        <BaseRadioGroup
          :items="items"
          :selected-value="selectedValue"
          :rules="rules"
          @change="onChange"
        />
      </div>
    </div>
    <!-- 2. 가로형 -->
    <BaseContentHorizontalLayout
      v-else
      :col-width-left="colWidthLeft"
    >
      <template v-slot:left>
        <div>
          <div class="pa-1">
            <BaseText
              bold
              :text="label"
            />
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div class="pt-3 pb-2">
          <BaseRadioGroup
            :items="items"
            :selected-value="selectedValue"
            :rules="rules"
            @change="onChange"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import BaseRadioGroup from './BaseRadioGroup';

export default {
  name: 'BaseRowLabelRadioGroup',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
    BaseRadioGroup,
  },
  props: {
    colWidthLeft: {
      type: String,
      default: '200px',
    },
    vertical: {
      type: Boolean,
    },
    label: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    selectedValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => ([]),
    },
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
