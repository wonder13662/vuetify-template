<template>
  <div
    class="base-content-h-layout d-flex align-start flex-row align-stretch"
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
// TODO 고정할 컬럼이 왼쪽인지 오른쪽인지 명확하게 표현하는 방식을 사용하는 편이 더 나을 것 같다.
export default {
  name: 'BaseContentHorizontalLayout',
  props: {
    colWidthLeft: {
      type: String,
      default: '',
    },
    colWidthRight: {
      type: String,
      default: '',
    },
    // @ Deprecated
    fixedColWidth: {
      type: String,
      default: '',
    },
    // @ Deprecated
    fixedColLeft: {
      type: Boolean,
    },
    color: {
      type: String,
      validator: (v) => ['grey', 'white', 'transparent'].includes(v),
      default: 'white',
    },
    // @ Deprecated
    showDivider: {
      type: Boolean,
    },
    divider: {
      type: Boolean,
    },
  },
  computed: {
    classLeftCol() {
      if (this.colWidthRight) {
        return {
          'flex-grow-1': true,
          white: true,
        };
      }

      if (this.colWidthLeft) {
        return {
          'flex-grow-1': false,
          white: true,
        };
      }

      // @ Deprecated
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
      if (this.colWidthLeft && !this.colWidthRight) {
        return {
          width: `${this.colWidthLeft}`,
          'min-width': `${this.colWidthLeft}`,
        };
      }
      // @ Deprecated
      if (this.fixedColLeft) {
        return {
          width: `${this.fixedColWidth}`,
          'min-width': `${this.fixedColWidth}`,
        };
      }
      return '';
    },
    classRightCol() {
      if (this.colWidthLeft) {
        return {
          'flex-grow-1': true,
          'base-content-h-layout__right': this.showDivider || this.divider,
          white: true,
        };
      }

      if (this.colWidthRight) {
        return {
          'flex-grow-1': false,
          'base-content-h-layout__right': this.showDivider || this.divider,
          white: true,
        };
      }

      // @ Deprecated
      return {
        'flex-grow-1': this.fixedColLeft,
        'lighten-3': this.fixedColLeft,
        'lighten-2': !this.fixedColLeft,
        'base-content-h-layout__right': this.showDivider || this.divider,
        grey: this.color === 'grey',
        white: this.color === 'white',
        transparent: this.color === 'transparent',
      };
    },
    styleRightCol() {
      if (this.colWidthRight && !this.colWidthLeft) {
        return {
          width: `${this.colWidthRight}`,
          'min-width': `${this.colWidthRight}`,
        };
      }
      // @ Deprecated
      if (!this.fixedColLeft) {
        return {
          width: `${this.fixedColWidth}`,
          'min-width': `${this.fixedColWidth}`,
        };
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content-h-layout {
  height: 100%;
}
.base-content-h-layout__right {
  border-left: solid 1px rgba(0, 0, 0, 0.12) !important;
}
</style>
