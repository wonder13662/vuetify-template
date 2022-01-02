<template>
  <div
    class="base-content-layout d-flex align-start flex-row align-stretch"
  >
    <div
      class="grey"
      :class="classLeftCol"
      :style="styleLeftCol"
    >
      <slot name="left" />
    </div>
    <div
      class="grey"
      :class="classRightCol"
      :style="styleRightCol"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseContentHorizontalLayout',
  props: {
    fixedColWidth: {
      type: String,
      default: '',
    },
    fixedColLeft: {
      type: Boolean,
    },
  },
  computed: {
    classLeftCol() {
      return {
        'flex-grow-1': !this.fixedColLeft,
        'lighten-3': !this.fixedColLeft,
        'lighten-2': this.fixedColLeft,
      };
    },
    styleLeftCol() {
      return this.fixedColLeft ? { width: `${this.fixedColWidth}` } : '';
    },
    classRightCol() {
      return {
        'flex-grow-1': this.fixedColLeft,
        'lighten-3': this.fixedColLeft,
        'lighten-2': !this.fixedColLeft,
      };
    },
    styleRightCol() {
      return !this.fixedColLeft ? { width: `${this.fixedColWidth}` } : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content-layout {
  height: 100%;
}
</style>
