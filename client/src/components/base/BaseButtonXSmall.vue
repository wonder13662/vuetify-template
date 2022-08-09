<template>
  <v-btn
    elevation="0"
    class="no-effect-upper-case"
    :disabled="disabled"
    :block="block"
    :outlined="!primary && !error"
    :color="color"
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
    primary: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
  },
  computed: {
    color() {
      if (this.primary) {
        return 'primary';
      }
      if (this.error) {
        return 'error';
      }
      return null;
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
