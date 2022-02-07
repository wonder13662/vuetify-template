<template>
  <div
    :class="classObject"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseTinyTable',
  props: {
    border: {
      type: Boolean,
    },
  },
  computed: {
    classObject() {
      return {
        box: this.border,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  border: solid 1px #BDBDBD;
}
</style>
