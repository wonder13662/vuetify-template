<template>
  <v-list-item
    dense
    class="px-2"
    :class="{ striped: hasStriped }"
  >
    <slot />
  </v-list-item>
</template>

<script>
export default {
  props: {
    hasStriped: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.striped {
  background-color:#F5F5F5;
}
</style>
