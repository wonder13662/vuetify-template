<template>
  <div
    class="text-caption base-text"
    :class="classObject"
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
    white: {
      type: Boolean,
    },
  },
  computed: {
    classObject() {
      return {
        'red--text': this.warning,
        'font-weight-bold': this.bold,
        'base-text-align-center': this.center,
        'white--text': this.white,
      };
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
