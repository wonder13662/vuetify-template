<template>
  <BaseContentHorizontalLayout
    col-width-left="100px"
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
          :text="value"
        />
      </div>
    </template>
  </BaseContentHorizontalLayout>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';

export default {
  name: 'ControlPanelRow',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
