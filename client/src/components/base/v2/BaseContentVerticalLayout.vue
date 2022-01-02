<template>
  <div
    class="base-content-vertial-layout grey lighten-2 d-flex align-start flex-column"
  >
    <div
      class="base-content-vertial-layout-row grey"
    >
      <slot name="head" />
    </div>
    <div
      class="base-content-vertial-layout-row grey lighten-1 flex-grow-1"
    >
      <slot name="body" />
    </div>
    <div
      v-if="hasTail"
      class="base-content-vertial-layout-row grey darken-1"
    >
      <slot name="tail" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseContentVerticalLayout',
  props: {
    hasTail: {
      type: Boolean,
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
</style>
