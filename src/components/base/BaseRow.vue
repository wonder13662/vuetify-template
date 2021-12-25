<template>
  <v-row
    no-gutters
    class="base-row"
    :class="classObject"
  >
    <slot />
  </v-row>
</template>

<script>
// TODO border-right: solid 1px #E0E0E0;
export default {
  name: 'BaseRow',
  props: {
    noMarginPadding: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
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
          'pa-0': true,
          'ma-1': true,
        };
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-row {
  height: 100%;
}
</style>
