<!-- eslint-disable max-len -->
<template>
  <div
    class="base-content-vertial-layout d-flex align-start flex-column"
  >
    <div
      class="bcvl-head base-content-vertial-layout-row transparent"
    >
      <slot name="head" />
    </div>
    <div
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
</style>
