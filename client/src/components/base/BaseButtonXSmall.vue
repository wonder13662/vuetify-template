<template>
  <v-btn
    class="no-effect-upper-case"
    :disabled="disabled"
    :block="block"
    outlined
    x-small
    @click.stop="onClick"
  >
    {{ name }}
  </v-btn>
</template>

<script>
export default {
  name: 'BaseButtonXSmall',
  props: {
    disabled: {
      type: Boolean,
    },
    block: {
      type: Boolean,
    },
    name: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.no-effect-upper-case {
  text-transform: none;
}
</style>
