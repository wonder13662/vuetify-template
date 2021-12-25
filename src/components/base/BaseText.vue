<template>
  <div
    class="text-caption base-text"
    :class="{ 'red--text':warning }"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    warning: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-text {
  overflow-wrap: break-word;
}
</style>
