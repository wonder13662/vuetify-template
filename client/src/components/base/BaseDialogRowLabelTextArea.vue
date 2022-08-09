<template>
  <div>
    <div class="pa-1">
      <BaseText
        bold
        :text="label"
      />
    </div>
    <div class="pa-1">
      <BaseTextArea
        :text="text"
        :max-count="maxCount"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
import BaseText from '@/components/base/BaseText';
import BaseTextArea from '@/components/base/BaseTextArea';

export default {
  name: 'BaseDialogRowLabelTextArea',
  components: {
    BaseText,
    BaseTextArea,
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
    maxCount: {
      type: Number,
      required: true,
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
