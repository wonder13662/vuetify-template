<!-- eslint-disable max-len -->
<template>
  <div
    class="base-content-vertial-layout d-flex align-start flex-column"
  >
    <div
      :class="classHeadBorderBottom"
      class="bcvl-head base-content-vertial-layout-row transparent"
    >
      <slot name="head" />
    </div>
    <div
      :class="classBodyBorderBottom"
      class="bcvl-body base-content-vertial-layout-row base-content-vertial-layout-row-body transparent lighten-1 flex-grow-1"
      :style="{ height: bodyHeight }"
    >
      <slot name="body" />
    </div>
    <div
      class="bcvl-tail base-content-vertial-layout-row transparent darken-1"
    >
      <slot name="tail" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseContentVerticalLayout',
  props: {
    bodyHeight: {
      type: String,
      required: true,
    },
    divider: {
      type: Boolean,
    },
  },
  computed: {
    classHeadBorderBottom() {
      return {
        'base-content-vertial-layout__divider-bottom': this.$slots.body && this.divider,
      };
    },
    classBodyBorderBottom() {
      return {
        'base-content-vertial-layout__divider-bottom': this.$slots.tail && this.divider,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content-vertial-layout {
  height: 100%;
}
.base-content-vertial-layout-row {
  width: 100%;
}
.base-content-vertial-layout-row-body {
  overflow: auto;
}
.base-content-vertial-layout__divider-bottom {
  border-bottom: solid 1px rgba(0, 0, 0, 0.12) !important;
}
</style>
