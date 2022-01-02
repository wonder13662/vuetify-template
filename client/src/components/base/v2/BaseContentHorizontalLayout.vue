<template>
  <div
    class="base-content-layout d-flex align-start flex-row align-stretch"
  >
    <div
      :class="classLeftCol"
      :style="styleLeftCol"
    >
      <slot name="left" />
    </div>
    <div
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
    color: {
      type: String,
      validator: (v) => ['grey', 'white', 'transparent'].includes(v),
      default: 'grey',
    },
  },
  computed: {
    classLeftCol() {
      return {
        'flex-grow-1': !this.fixedColLeft,
        'lighten-3': !this.fixedColLeft,
        'lighten-2': this.fixedColLeft,
        grey: this.color === 'grey',
        white: this.color === 'white',
        transparent: this.color === 'transparent',
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
        grey: this.color === 'grey',
        white: this.color === 'white',
        transparent: this.color === 'transparent',
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
