<template>
  <v-overlay
    :value="isShow"
    :z-index="zIndex"
  >
    <v-progress-circular
      indeterminate
    />
  </v-overlay>
</template>

<script>
export default {
  name: 'BaseOverlayProgressCircular',
  props: {
    isShow: {
      type: Boolean,
    },
    zIndex: {
      type: Number,
      default: 110,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
