<template>
  <div>
    <BaseContentHorizontalLayout
      :col-width-left="colWidthLeft"
    >
      <template v-slot:left>
        <div class="pa-1">
          <BaseText
            bold
            :text="label"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <BaseText
            :text="text"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <v-divider />
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';

export default {
  name: 'BaseRowLabelText',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
  },
  props: {
    label: {
      type: [String, Number],
      required: true,
    },
    text: {
      type: [String, Number],
      required: true,
    },
    colWidthLeft: {
      type: String,
      default: '180px',
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
