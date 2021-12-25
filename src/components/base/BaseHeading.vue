<template>
  <div
    :class="{ 'text-h6': size === 0, 'text-h4': size === 1 }"
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
    size: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
