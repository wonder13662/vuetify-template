<template>
  <div
    :class="{ 'text-h6': size === 0 && !large, 'text-h4': size === 1 || large }"
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
    // @ Deprecated
    size: {
      type: Number,
      default: 0,
    },
    large: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
