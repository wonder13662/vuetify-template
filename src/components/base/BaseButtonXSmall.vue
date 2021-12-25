<template>
  <v-btn
    :disabled="disabled"
    :block="block"
    outlined
    x-small
    @click="onClick"
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
      type: String,
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

</style>
