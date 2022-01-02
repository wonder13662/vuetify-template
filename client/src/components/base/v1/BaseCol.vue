<template>
  <v-col
    :cols="cols"
    :style="styleObject"
    class="flex-grow-1 flex-shrink-0 base-col"
    :class="classObject"
  >
    <slot />
  </v-col>
</template>

<script>
// TODO 고정 너비와 반응형 너비 기능 추가 필요
export default {
  name: 'BaseCol',
  props: {
    cols: {
      type: Number,
      default: 12,
    },
    fixedWidthPixel: {
      type: Number,
      default: -1,
    },
    subtractHeight: {
      type: Number,
      default: 0,
    },
    noMarginPadding: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    styleObject() {
      let result = {};
      // TODO 자신이 가질 수 있는 최대 너비를 CSS를 통해서만 구할수는 없을까?
      if (this.subtractHeight > 0) {
        result = {
          ...result,
          height: `calc(100vh - ${this.subtractHeight}px)`,
        };
      }
      if (this.fixedWidthPixel > 0) {
        result = {
          ...result,
          minWidth: `${this.fixedWidthPixel}px`,
          maxWidth: `${this.fixedWidthPixel}px`,
        };
      } else {
        result = {
          ...result,
          maxWidth: 'max-width: 100%;',
        };
      }
      return result;
    },
    classObject() {
      let result = {};
      if (this.noMarginPadding) {
        result = {
          ...result,
          'pa-0': true,
          'ma-0': true,
        };
      } else {
        result = {
          ...result,
          'pa-1': true,
          'ma-0': true,
        };
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-col {
  background-color: transparent;
}
</style>
