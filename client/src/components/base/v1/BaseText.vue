<template>
  <div
    class="text-caption base-text"
    :class="{ 'red--text':warning, 'font-weight-bold':bold, 'base-text-align-center':center }"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    warning: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
    },
    center: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-text {
  overflow-wrap: break-word;
}
.base-text-align-center {
  text-align: center;
}
</style>
