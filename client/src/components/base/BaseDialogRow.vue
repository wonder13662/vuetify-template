<template>
  <BaseContentHorizontalLayout
    col-width-left="140px"
  >
    <template v-slot:left>
      <div class="pa-2">
        <BaseText
          :text="label"
          bold
        />
      </div>
    </template>
    <template v-slot:right>
      <div class="pa-2">
        <BaseText
          :text="text"
        />
      </div>
    </template>
  </BaseContentHorizontalLayout>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';

export default {
  name: 'BaseDialogRow',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
